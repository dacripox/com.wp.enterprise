var express = require('express');
var mainController = require('../controllers/mainController.js');
var router = express.Router();



/*
 * GET
 */

router.get('/promotion/', mainController.showPromotion);


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