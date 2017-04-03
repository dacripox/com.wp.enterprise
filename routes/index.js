var express = require('express');
var mainController = require('../controllers/mainController.js');
var router = express.Router();


/*
 * GET
 */
router.get('/', mainController.showMainIndex);


module.exports = router;