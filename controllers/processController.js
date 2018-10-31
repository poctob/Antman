var GoogleDocsService = require('../services/googleDocsService');
var GoogleSheetsService = require('../services/googleSheetsService');

const service = new GoogleDocsService();
const sheetsService = new GoogleSheetsService();

module.exports = class ProcessController {
  
  constructor() {
    this.getDatePart = this.getDatePart.bind(this);
    this.getAll = this.getAll.bind(this);
  }

  async getAll(req, res, next) {
    try {
      let datePart = await this.getDatePart(); 
     // let data = await service.addFolder('AppTestasdf' + datePart);
      let sheetsdata = await sheetsService.readSheet();
      res.send('This is Process Controller!' + sheetsdata);
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
