var express = require('express');
var mainController = require('../controllers/mainController.js');
var router = express.Router();



/*
 * GET
 */

router.get('/promotion/:promoId', mainController.showPromotion);


/*
 * POST
 */

router.post('/promotion/', mainController.createUpdatePromotion);


/*
 * GET
 */

router.get('/available/:promoId', mainController.promotionIdAvailable);



/*
 * GET
 */

router.get('/promotions', mainController.getPromotions);


module.exports = router;