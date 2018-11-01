// var GoogleAuthService = require('../services/googleAuthService');

// const service = new GoogleAuthService();

// async function authorize() {
//  let result = await service.authorize('configuration/credentials.sheets.json', 'token.sheets.json', ['https://www.googleapis.com/auth/spreadsheets']);
// }

// authorize();

const DynamoDBService = require('../services/dynamoDBService');
const service = new DynamoDBService();

//var result = service.writeTableData('XTProjects', {'ProjectId': 4010, 'Title': 'TestTitle2'});
// var result = service.readTableData('XTProjects',  {
//         "ProjectId": 4010
//     });

async function run() {
    let data = await service.getAll('XTCustomers');
    let items = data.Items;
    items.forEach(x => console.log(x.projects));
    //console.log(items);
}

run();