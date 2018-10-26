const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

const { promisify } = require('util');


const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

module.exports = class GoogleAuthService {


    async authorize(credentialsPath, tokenPath, scopes) {
        try {

            let content = await readFile(credentialsPath);
            let auth = await this.authorizeService(JSON.parse(content), tokenPath, scopes);

            return auth;
        }
        catch (err) {
            return console.log('Error processing the request:', err);
        }
    }

    async authorizeService(credentials, tokenPath, scopes) {
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        try {
            let token = await readFile(tokenPath);
            oAuth2Client.setCredentials(JSON.parse(token));
            return oAuth2Client;
        }
        catch (err) {
            return await this.getAccessToken(oAuth2Client, tokenPath, scopes);
        }
    }

    async getAccessToken(oAuth2Client, tokenPath, scopes) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', async(code) => {
            rl.close();

            try {

                let token = await oAuth2Client.getToken(code);
                oAuth2Client.setCredentials(token);

                let result = await writeFile(tokenPath, JSON.stringify(token.tokens));
                console.log('Token stored to', tokenPath);
            

            }
            catch (err) {
                return console.error('Error retrieving access token', err);
            }
        });
    }
}
