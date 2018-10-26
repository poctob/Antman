const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

const { promisify } = require('util');

const AuthService = require('./googleAuthService');

module.exports = class GoogleDocsService {

    constructor() {

    }

    async addFolder(path) {
        try {

            let authService = new AuthService();
            let auth = await authService.authorize(
                'configuration/credentials.json',
                'token.json', ['https://www.googleapis.com/auth/drive']);

            let data = await this.createFolderCannonical(auth, path);

            return data;
        }
        catch (err) {
            return console.log('Error processing the request:', err);
        }
    }

    async createFolderCannonical(auth, folderPath) {
        let folders = folderPath.split('/');
        let folderId = '';

        //Handle root
        if (folders.length) {
            try {
                folderId = await this.createFolder(auth, folders[0], 'root');

                folders.splice(0, 1);

                for (let index in folders) {
                    folderId = await this.createFolder(auth, folders[index], folderId);
                }
                return 'Folder created successfully';
            }
            catch (err) {
                console.log("Unable to create folder: " + err);
            }
        }
    }

    async createFolder(auth, folderName, parentName) {

        let folderExists = await this.doesFolderExist(auth, folderName, parentName);
        if (!folderExists) {
            return await this.createObject(auth, folderName, 'application/vnd.google-apps.folder', parentName);
        }
        else if (typeof folderExists === 'string' || folderExists instanceof String) {
            return folderExists;
        }
        else {

            throw 'Found multiple folders with the name: ' + folderName;
        }
    }

    async doesFolderExist(auth, folderName, parentName) {
        return await this.doesObjectExist(auth, folderName, 'application/vnd.google-apps.folder', parentName);
    }

    async doesObjectExist(auth, objectName, objectType, objectParent) {
        const drive = google.drive({ version: 'v3', auth });
        const listDriveFiles = promisify(drive.files.list);

        try {
            let result = await listDriveFiles({
                q: "mimeType='" + objectType + "' and name='" + objectName +
                    "' and '" + objectParent +
                    "' in parents and trashed = false",
                fields: 'nextPageToken, files(id, name)',
                spaces: 'drive'
            });

            const files = result.data.files;
            if (!files.length) {
                return false;
            }
            else if (files.length == 1) {
                return files[0].id;
            }
            else {
                return true;
            }
        }
        catch (err) {
            return 'The API returned an error: ' + err;
        }
    }

    async createObject(auth, objectName, objectType, objectParent) {
        const fileMetadata = {
            'name': objectName,
            'mimeType': objectType,
            'parents': [objectParent]
        };

        const drive = google.drive({ version: 'v3', auth });
        const createDriveFolder = promisify(drive.files.create);

        try {
            let folder = await createDriveFolder({
                resource: fileMetadata,
                fields: 'id'
            });
            return folder.data.id;
        }
        catch (err) {
            return 'The API returned an error: ' + err;
        }
    }
}
