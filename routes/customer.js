var express = require('express');
var router = express.Router();
var Controller = require('../controllers/customerController');

const controller = new Controller();

router.get('/', controller.getAll);
router.post('/', controller.create);

module.exports = router;
