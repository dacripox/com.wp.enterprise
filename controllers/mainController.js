let fetch = require('isomorphic-fetch');
var mobileDetect = require('mobile-detect');

let getPromotionsByCompanyId = async (companyId) => {
    try {
        let response = await fetch('http://localhost:3000/promotion/company/'+companyId, {method:'get'});
        let data = await response.json();
        if (response.status !== 200) {
            return;
        }
        return data;
    } catch (error) {

        console.error('Fetch error. STATUS: ' + response.status);
        console.error(error);
    }
}

let newPromotion = async (promotion) => {

     /*   let newPromo = new FormData();

        newPromo.append('promoId', promotion.promoId);
        newPromo.append('promoEnabled', promotion.promoEnabled);
        newPromo.append('startDate', promotion.startDate);
        newPromo.append('endDate', promotion.endDate);
        newPromo.append('promoTitle', promotion.promoTitle);
        newPromo.append('promoLegalCond', promotion.promoLegalCond);
        newPromo.append('promoDescription', promotion.promoDescription);
        newPromo.append('promoContactDetails', promotion.promoContactDetails);
        newPromo.append('promoImage', promotion.promoImage);
        newPromo.append('socialImage', promotion.socialImage);
        newPromo.append('winnersNumber', promotion.winnersNumber);
        newPromo.append('showLocalization', promotion.showLocalization);
        newPromo.append('lat', promotion.lat);
        newPromo.append('lng', promotion.lng);
        newPromo.append('postalCode', promotion.postalCode);
        newPromo.append('fullAddress', promotion.fullAddress);
        newPromo.append('companyId', promotion.companyId);
        newPromo.append('trollNumber', promotion.trollNumber);
        newPromo.append('shareMessages', promotion.shareMessages);
        newPromo.append('facebookTrackingPixel', promotion.facebookTrackingPixel);
        newPromo.append('googleTrackingPixel', promotion.googleTrackingPixel);
*/

    var fetchOptions = {
        method: 'POST',
        body: function(){ 
            let newPromo = new FormData();

            newPromo.append('promoId', promotion.promoId);
            newPromo.append('promoEnabled', promotion.promoEnabled);
            newPromo.append('startDate', promotion.startDate);
            newPromo.append('endDate', promotion.endDate);
            newPromo.append('promoTitle', promotion.promoTitle);
            newPromo.append('promoLegalCond', promotion.promoLegalCond);
            newPromo.append('promoDescription', promotion.promoDescription);
            newPromo.append('promoContactDetails', promotion.promoContactDetails);
            newPromo.append('promoImage', promotion.promoImage);
            newPromo.append('socialImage', promotion.socialImage);
            newPromo.append('winnersNumber', promotion.winnersNumber);
            newPromo.append('showLocalization', promotion.showLocalization);
            newPromo.append('lat', promotion.lat);
            newPromo.append('lng', promotion.lng);
            newPromo.append('postalCode', promotion.postalCode);
            newPromo.append('fullAddress', promotion.fullAddress);
            newPromo.append('companyId', promotion.companyId);
            newPromo.append('trollNumber', promotion.trollNumber);
            newPromo.append('shareMessages', promotion.shareMessages);
            newPromo.append('facebookTrackingPixel', promotion.facebookTrackingPixel);
            newPromo.append('googleTrackingPixel', promotion.googleTrackingPixel);
            return newPromo
        }
    };
    try {
        let response = await fetch('http://localhost:3000/promotion/', fetchOptions);
        let data = await response.json();
        if (response.status !== 200) {
            return;
        }
        return data;
    } catch (error) {

        console.error('Fetch error. STATUS: ' + response.status);
        console.error(error);
    }
};


/**
 * mainController.js
 *
 * @description :: Server-side logic.
 */
module.exports = {
    /**
     * mainController.showMainIndex()
     */
    showMainIndex: async function (req, res) {
        var promoId = req.params.promoId;
        var refFriend = req.params.refFriend;

let promotions = await getPromotionsByCompanyId('58e3a7ec4b05fd09d0a2db2a');

        let md = new mobileDetect(req.headers['user-agent']);
        if (md.is('bot')) {
            console.log('bot access');
        } else if (md.mobile() != null) {
            console.log('phone access');
        } else if (md.is('desktopmode')) {
            console.log('desktopmode access');
        } else {
            console.log('other device access');
        }

        //Desktop view
        res.render('desktop-version', { title: 'No title', promotions:promotions });
    },



/**
     * mainController.promotionIdAvailable()
     */
    promotionIdAvailable: async function (req, res) {
        var promoId = req.params.promoId;
       
    try {
        let response = await fetch('http://localhost:3000/promotion/available/'+promoId, {method:'GET'});
        let data = await response.json();
        if (response.status !== 200) {
             return res.status(500).json({response:response});
        }
        return  res.status(200).json(data);

    } catch (error) {

        console.error('Fetch error. STATUS: ' + response.status);
        console.error(error);
        return res.status(500).json({
            error: error
        });
    }
        
    },

/**
     * mainController.getPromotions()
     */
    getPromotions: async function (req, res) {
      let companyId = req.cookies.companyId;
       
    return await getPromotionsByCompanyId(companyId);
        
    },


    createPromotion: async function (req, res) {

        let promotion = {};

        promotion.promoId = req.body.promoId;
        promotion.promoEnabled = req.body.promoEnabled;
        promotion.startDate = req.body.startDate;
        promotion.endDate = req.body.endDate;
        promotion.promoTitle = req.body.promoTitle;
        promotion.promoLegalCond = req.body.promoLegalCond;
        promotion.promoDescription = req.body.promoDescription;
        promotion.promoContactDetails = req.body.promoContactDetails;
        promotion.promoImage = req.body.promoImage;
        promotion.socialImage = req.body.socialImage;
        promotion.winnersNumber = req.body.winnersNumber;
        promotion.showLocalization = req.body.showLocalization;
        promotion.lat = req.body.lat;
        promotion.lng = req.body.lng;
        promotion.postalCode = req.body.postalCode;
        promotion.fullAddress = req.body.fullAddress;
        promotion.companyId = req.body.companyId;
        promotion.trollNumber = req.body.trollNumber;
        promotion.shareMessages = req.body.shareMessages;
        promotion.facebookTrackingPixel = req.body.facebookTrackingPixel;
        promotion.googleTrackingPixel = req.body.googleTrackingPixel;

        let newPromo = await newPromotion(promotion);


    }

}
