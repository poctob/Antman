const { google } = require('googleapis');

const { promisify } = require('util');

const AuthService = require('./googleAuthService');

module.exports = class GoogleDocsService {

    constructor() {  }

    async readSheet(sheetId) {
        try {
            let authService = new AuthService();
            let auth = await authService.authorize(
                'configuration/credentials.sheets.json',
                'token.sheets.json', ['https://www.googleapis.com/auth/spreadsheets']);

            let data = await this.readNotNullValuesSheet(
                auth,
                sheetId,
                '2018');

            return data;
        }
        catch (err) {
            return console.log('Error processing the request:', err);
        }
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

    async readNotNullValuesSheet(auth, documentId, sheetId) {
        const sheets = google.sheets({ version: 'v4', auth });
        const sheetsGetValues = promisify(sheets.spreadsheets.values.get);

        try {
            let result = await sheetsGetValues({
                spreadsheetId: documentId,
                range: sheetId + '!A2:T'
            });

            const rows = result.data.values;
            if (rows.length) {

                let projects = rows                   
                    .filter(r => r[0] !== undefined);



                return projects;
            }
            else {
                console.log('No data found.');
                return null;
            }
        }
        catch (err) {
            return 'The API returned an error: ' + err;
        }
    }

    async getMaxProjectNumber(auth, documentId, sheetId) {
        const sheets = google.sheets({ version: 'v4', auth });
        const sheetsGetValues = promisify(sheets.spreadsheets.values.get);

        try {
            let result = await sheetsGetValues({
                spreadsheetId: documentId,
                range: sheetId + '!A2:A'
            });

            const rows = result.data.values;
            if (rows.length) {

                let ids = rows
                    .map(row => row[0])
                    .filter(r => r !== undefined);



                return {
                    'rowNumber': ids.length + 1, // Account for the header row
                    'rowValue': Math.max(...ids)
                };
            }
            else {
                console.log('No data found.');
                return null;
            }
        }
        catch (err) {
            return 'The API returned an error: ' + err;
        }
    }
}
