var express = require('express');
var mainController = require('../controllers/mainController.js');
var router = express.Router();


/*
 * GET
 */
router.get('/participate/:userId/:promoId', mainController.showMainIndex);


/*
 * POST
 */
router.post('/report/:userId/:promoId', mainController.showMainIndex);


/*
 * PUT
 */
router.put('/update-profile/:userId', mainController.showMainIndex);


/*
 * POST
 */
router.put('/update-profile-settings/:userId', mainController.showMainIndex);


module.exports = router;