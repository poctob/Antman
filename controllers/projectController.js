var Customer = require('../models/customer');
const uuidv4 = require('uuid/v4');
const DynamoDBService = require('../services/dynamoDBService');

const service = new DynamoDBService();

module.exports = class ProjectController {

  constructor() {
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.sanitizeCustomer = this.sanitizeCustomer.bind(this);
  }

  async getAll(req, res, next) {
    try {

      let data = await service.getAll('XTCustomers', 'CustomerId, #name, projects', { '#name': "name" });
      res.send(data.Items);
    }
    catch (err) {
      console.log('Error processing the request: ' + err);
      res.status(500).end();
    }
  }

  async getByCustomerId(req, res, next) {
    try {
      let data = await service.getAll(
        'XTCustomers', 
        'CustomerId, #name, projects', 
        { '#name': "name" },
        'CustomerId = :customerId',
        {':customerId' : req.params.customerId});
      res.send(data.Items);
    }
    catch (err) {
      console.log('Error processing the request: ' + err);
      res.status(500).end();
    }
  }

  async create(req, res, next) {
    try {
      //replace the id
      let customer = req.body;
      customer.CustomerId = uuidv4();
      this.sanitizeCustomer(customer);

      await service.writeTableData('XTCustomers', customer)
      res.send(customer);
    } catch (err) {
      console.log('Error processing the request: ' + err);
      res.status(500).end();
    }
  }

  async update(req, res, next) {
    try {
      let customer = req.body;
      this.sanitizeCustomer(customer);

      await service.writeTableData('XTCustomers', customer)
      res.send(customer);

    } catch (err) {

      console.log('Error processing the request: ' + err);
      res.status(500).end();
    }
  }

  sanitizeCustomer(customer) {
    Object.keys(customer).forEach((key) => (customer[key] == null) && delete customer[key]);
  }
}
