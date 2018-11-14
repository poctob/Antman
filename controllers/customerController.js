var Customer = require('../models/customer');
const uuidv4 = require('uuid/v4');
const DynamoDBService = require('../services/dynamoDBService');

const service = new DynamoDBService();

module.exports = class CustomerController {

  constructor() {
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.sanitizeCustomer = this.sanitizeCustomer.bind(this);
    this.getByCustomerId = this.getByCustomerId.bind(this);
    this.doGetByCustomerId = this.doGetByCustomerId.bind(this);
  }

  async getAll(req, res, next) {
    try {

      // let data = await service.getAll('XTCustomers', 'CustomerId, #n', { '#n': 'name' });
      let data = await service.getAll('XTCustomers');
      //console.log(data);
      res.send(data.Items);
    }
    catch (err) {
      console.log('Error processing the request: ' + err);
      res.status(500).end();
    }
  }

  async getByCustomerId(req, res, next) {
    let data = await this.doGetByCustomerId(req.params.customerId);
    if (data)
      res.send(data);
    else
      res.status(500).end();
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

  async doGetByCustomerId(customerId) {
    try {
      let data = await service.getAll('XTCustomers', null, null,
         'CustomerId = :customerId', { ':customerId': customerId });

      return data.Items;
    }
    catch (err) {
      console.log('Error processing the request: ' + err);
      return null;
    }
  }
}
