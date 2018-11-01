//var GoogleAuthService = require('../services/googleAuthService');
var GoogleSheetsService = require('../services/googleSheetsService');
var Customer = require('../models/customer');
var Project = require('../models/project');
const uuidv4 = require('uuid/v4');
const DynamoDBService = require('../services/dynamoDBService');

//const service = new GoogleAuthService();
const sheetsService = new GoogleSheetsService();
const dynamoDBService = new DynamoDBService();
var customers = new Map();

async function authorize() {
    //let result = await service.authorize('configuration/credentials.sheets.json', 'token.sheets.json', ['https://www.googleapis.com/auth/spreadsheets']);
    let data = await sheetsService.readSheet('1mqVLXHYjs8UtsUGmyYOCg33A6S1kFvIVI_7cGdoIECo');
    await data.forEach(addCustomer);
    for(var value of customers.values()) {
        await dynamoDBService.writeTableData('XTCustomers', value);
    }
}

async function addCustomer(row) {
    let name = row[2];
    let customer = null

    if (name) {
        if (!customers.has(name.toLowerCase())) {
            customer = new Customer();
            customer.CustomerId = uuidv4();
            customer.name = name;
            if(row[5]) customer.email = row[5];
            if(row[4]) customer.phone = row[4];
            customers.set(name.toLowerCase(), customer);
        } else {
            customer = customers.get(name.toLowerCase());
        }
    }

    if(customer) {
        let project = new Project();
        project.ProjectId = row[0];
        if(row[1]) project.type = row[1];
        if(row[3]) project.documentType = row[3];
        if(row[6]) project.received = row[6];
        if(row[7]) project.started = row[7];
        if(row[8]) project.mailed = row[8];
        if(row[9]) project.status = row[9];
        if(row[10]) project.price = row[10];
        if(row[11]) project.postage = row[11];
        if(row[12]) project.discount = row[12];
        if(row[13]) project.total = row[13];
        if(row[14]) project.invoiceDate = row[14];
        if(row[15]) project.paymentDate = row[15];
        if(row[16]) project.paymentType = row[16];
        if(row[17]) project.translator = row[17];
        if(row[18]) project.sourceLanguage = row[18];
        if(row[19]) project.destinationLanguage = row[19];

        customer.addProject(project);
    }
}


authorize();