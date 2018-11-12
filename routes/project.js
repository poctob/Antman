var express = require('express');
var router = express.Router();
var Controller = require('../controllers/projectController');

const controller = new Controller();

router.get('/', controller.getAll);
router.post('/', controller.create);
router.put('/', controller.update);

module.exports = router;
