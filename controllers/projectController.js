var Model = require('../models/model');
const uuidv4 = require('uuid/v4');
const DynamoDBService = require('../services/dynamoDBService');
const CustomerController = require('./customerController');

const service = new DynamoDBService();

module.exports = class ProjectController {

  constructor() {
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.getByCustomerId = this.getByCustomerId.bind(this);
    this.getAll = this.getAll.bind(this);
    this.convertCurrency = this.convertCurrency.bind(this);
    this.model = new Model();
    this.customerController = new CustomerController();
  }

  async getAll(req, res, next) {
    try {

      let data = await service.getAll('XTCustomers', 'CustomerId, #name, projects', { '#name': "name" });
      data.Items = data.Items.map(customer => {
        this.convertCurrency(customer);
        return customer;
      });
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
        { ':customerId': req.params.customerId });

      this.convertCurrency(data.Items[0]);
      res.send(data.Items);
    }
    catch (err) {
      console.log('Error processing the request: ' + err);
      res.status(500).end();
    }
  }

  async update(req, res, next) {
    try {
      let customer = await this.customerController.doGetByCustomerId(req.body.CustomerId);

      if (customer && customer.length > 0) {
        let project = req.body;

        delete project.CustomerId;
        delete project.CustomerName;
        this.model.sanitize(project);

        let existingProjects = customer[0].projects.filter(proj => proj.ProjectId != project.ProjectId);
        existingProjects.push(project);
        customer[0].projects = existingProjects;

        await service.writeTableData('XTCustomers', customer[0])
      }

      res.send(customer);
    } catch (err) {
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

  convertCurrency(customer) {
    let projects = customer.projects;
    if (projects)
      customer.projects = projects.map(x => this.model.convertCurrencyStringsToNumbers(x, ['price', 'postage', 'discount', 'total']));
  }
}
