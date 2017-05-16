var express = require('express');
var mainController = require('../controllers/mainController.js');
var router = express.Router();


/*
 * GET
 */
router.get('/admin/:promoId', mainController.showAdminDashboard);

/*
 * GET
 */
router.get('/', mainController.showMainIndex);




module.exports = router;