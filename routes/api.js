var express = require('express');
var mainController = require('../controllers/mainController.js');
var router = express.Router();


/*
 * POST
 */

router.post('/promotion/', mainController.createPromotion);


/*
 * GET
 */

router.get('/available/:promoId', mainController.promotionIdAvailable);



/*
 * GET
 */

router.get('/promotions', mainController.getPromotions);


module.exports = router;