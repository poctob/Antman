var Customer = require('../models/customer');
const uuidv4 = require('uuid/v4');
const DynamoDBService = require('../services/dynamoDBService');

const service = new DynamoDBService();

module.exports = class ProcessController {
  
  constructor() {
    this.getDatePart = this.getDatePart.bind(this);
    this.getAll = this.getAll.bind(this);
  }

  async getAll(req, res, next) {
    try {

      let data = await service.getAll('XTCustomers', 'CustomerId, #n', {'#n': 'name'});
      //console.log(data);
      res.send(data.Items);
    }
    catch (err) {
      console.log('Error processing the request: ' + err);
      res.status(500).end();
    }
  }

  async getDatePart() {
    let now = new Date();
    let month = now.getMonth() + 1;
    let datePart = '/' + now.getFullYear() + '/' + (month < 10 ? '0' + month : month);
    return datePart;
  }



}
