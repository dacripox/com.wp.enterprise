let fetch = require('isomorphic-fetch');
var mobileDetect = require('mobile-detect');
var md5 = require('md5');
let request = require('request-promise');

const uuidV4 = require('uuid/v4');
var Jimp = require("jimp");



let getParticipantsByPromoId = async (promoId) => {
    console.log('Finding Participants for promotion: ' + promoId);
    let formData = {};
    try {
        let response = await request.get({ url: 'http://localhost:3000/participation/promotion/' + promoId + '/full', form: formData });
        return JSON.parse(response);
    } catch (error) {
        console.error('Fetch error participations with full user details. ');
        console.error(error);
       
    }
}

let getPromotionsByCompanyId = async (companyId) => {
    try {
        let response = await fetch('http://localhost:3000/promotion/company/' + companyId, { method: 'get' });
        let data = await response.json();
        if (response.status !== 200) {
            return;
        }
        return data;
    } catch (error) {

        console.error('Fetch error. STATUS: ' + response.status);
        console.error(error);
        return;
    }
}




let createCompany = async (companyEmail) => {

    return new Promise(async (resolve, reject) => {
        var formData = {
            "cif": md5(companyEmail),
            "email": companyEmail
        };
        try {
            let response = await request.post({ url: 'http://localhost:3000/company/', form: formData });
            console.log(response);
            if (response) resolve(response);
            else reject();
        } catch (error) {
            reject(error);
        }

    })


}
/*
let getOrCreateCompany = async (companyEmail) => {
    console.log('Getting / Creating company');

    return new Promise(async (resolve, reject) => {
        var formData = {};
        request.get({ url: 'http://localhost:3000/company/email/' + companyEmail, form: formData }, async function (err, response, body) {
            if (response === null || response === undefined) {
                reject("Empty reponse");
            }
            var code = response.statusCode;
            if (!err && ((body && body.errors) || code > 399)) {
                if (code == 404) {
                    console.log("Trying to create a company.");
                    let company = await createCompany(companyEmail);
                    resolve(company.body);
                } else {
                    console.log('Company not created.' + response);
                    reject(response);
                }
            }
            resolve(response.body);

          

        });
    });

}
*/


let getOrCreateCompany = async (companyEmail) => {
    try {
        let response = await fetch('http://localhost:3000/company/email/' + companyEmail, { method: 'get' });
        let company = await response.json();

        if (response.status == 404) {
            console.log("Trying to create a company.");
            let company = await createCompany(companyEmail);
            return JSON.parse(company);
        } else if (response.status !== 200) {
            console.log('Company not created.' + response);
            return;
        } else {
            console.log('Company already exists');
            return company;
        }

    } catch (error) {
        console.error('Fetch error. STATUS');
        console.error(error);
        return;
    }
}


let newPromotion = async (promotion) => {


    var formData = {
        "promoType": promotion.promoType,
        "promoId": promotion.promoId,
        "priceItemAvg": promotion.priceItemAvg,
        "promoEnabled": promotion.promoEnabled,
        "startDate": promotion.startDate,
        "endDate": promotion.endDate,
        "promoTitle": promotion.promoTitle,
        "promoLegalCond": promotion.promoLegalCond,
        "promoDescription": promotion.promoDescription,
        "promoContactDetails": promotion.promoContactDetails,
        "promoImage": promotion.promoImage,
        "socialImage": promotion.socialImage,
        "winnersNumber": promotion.winnersNumber,
        "showLocalization": promotion.showLocalization,
        "lat": promotion.lat,
        "lng": promotion.lng,
        "postalCode": promotion.postalCode,
        "fullAddress": promotion.fullAddress,
        "companyId": promotion.companyId,
        "trollNumber": promotion.trollNumber,
        "shareMessages": promotion.shareMessages,
        "facebookTrackingPixel": promotion.facebookTrackingPixel,
        "googleTrackingPixel": promotion.googleTrackingPixel
    };

    try {
        let response = await request.post({ url: 'http://localhost:3000/promotion/', form: formData });
        console.log(response);
        if (response.status > 299) return;
        return response;
    } catch (error) {
        console.log(error);
        return;

    }

};


let updatePromotion = async (promotion) => {

    var formData = {
        "promoType": promotion.promoType,
        "promoId": promotion.promoId,
        "priceItemAvg": promotion.priceItemAvg,
        "promoEnabled": promotion.promoEnabled,
        "startDate": promotion.startDate,
        "endDate": promotion.endDate,
        "promoTitle": promotion.promoTitle,
        "promoLegalCond": promotion.promoLegalCond,
        "promoDescription": promotion.promoDescription,
        "promoContactDetails": promotion.promoContactDetails,
        "promoImage": promotion.promoImage,
        "socialImage": promotion.socialImage,
        "winnersNumber": promotion.winnersNumber,
        "showLocalization": promotion.showLocalization,
        "lat": promotion.lat,
        "lng": promotion.lng,
        "postalCode": promotion.postalCode,
        "fullAddress": promotion.fullAddress,
        "companyId": promotion.companyId,
        "trollNumber": promotion.trollNumber,
        "shareMessages": promotion.shareMessages,
        "facebookTrackingPixel": promotion.facebookTrackingPixel,
        "googleTrackingPixel": promotion.googleTrackingPixel
    };
    try {
        let response = await request.put({ url: 'http://localhost:3000/promotion/' + promotion.updatePromotionId, form: formData });
        console.log(response);
        if (response.status > 299) return;
        return response;
    } catch (error) {
        console.log(error);
        return;
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

        let companyEmail = req.cookies.companyEmail;
        console.log(companyEmail);

        if (!companyEmail) res.redirect(req.get('referer'));

        //Create company if not exists
        try {
            if (companyEmail) {
                // Promise.all(iterable)

                p = new Promise(async (resolve, reject) => {

                    let company = await getOrCreateCompany(companyEmail);
                    if (company) resolve(company);
                    else reject();
                })


                p.then(async (company) => {



                    let promotions = await getPromotionsByCompanyId(company._id);

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


                    let options = {
                        maxAge: 1000 * 60 * 15, // would expire after 15 minutes
                        // httpOnly: true, // The cookie only accessible by the web server
                        signed: false // Indicates if the cookie should be signed
                    }


                    console.log('companyId: ' + company._id)

                    // Set cookie
                    res.cookie('companyId', company._id, options) // options is optional



                    //Desktop view
                    res.render('desktop-version', { title: 'WhatsPromo - Panel de control', promotions: promotions });



                })

            }
        } catch (error) {
            console.log(error);
        }



    },



    /**
     * mainController.promotionIdAvailable()
     */
    promotionIdAvailable: async function (req, res) {
        var promoId = req.params.promoId;

        try {
            let response = await fetch('http://localhost:3000/promotion/available/' + promoId, { method: 'GET' });
            let data = await response.json();
            if (response.status !== 200) {
                return res.status(500).json({ response: response });
            }
            return res.status(200).json(data);

        } catch (error) {
            console.error('Fetch error. ');
            console.error(error);
            return res.status(500).json({
                error: error
            });
        }

    },

    /**
     * mainController.barchartStats()
     */
    barchartStats: async function (req, res) {
        var promoId = req.params.promoId;
        var day = req.params.day;
        var month = req.params.month;
        var year = req.params.year;

        try {
            let response = await fetch('http://localhost:3000/stats/barchart/promotion/' + promoId + '/date/' + day + '/' + month + '/' + year, { method: 'GET' });
            let data = await response.json();
            if (response.status !== 200) {
                return res.status(500).json({ response: response });
            }
            return res.status(200).json(data);

        } catch (error) {
            console.error('Fetch error when retrieving barchar stats');
            console.error(error);
            return res.status(500).json({
                error: error
            });
        }

    },
    /**
     * mainController.promotionStatsDates()
     */
    promotionStatsDates: async function (req, res) {
        var promoId = req.params.promoId;
        var day = req.params.day;
        var month = req.params.month;
        var year = req.params.year;

        try {
            let response = await fetch('http://localhost:3000/promotion/id/' + promoId, { method: 'GET' });
            let data = await response.json();
            if (response.status !== 200) {
                return res.status(500).json({ response: response });
            }

            async function getDates(startDate, stopDate) {
                var dateArray = new Array();


                let start = new Date(startDate);
                start.setHours(0);
                start.setMinutes(0);

                var currentDate = new Date(start);


                let end = new Date(stopDate);
                end.setHours(0);
                end.setMinutes(0);

                var stopDate = new Date(end);

                while (currentDate <= stopDate) {
                    dateArray.push(new Date(currentDate))
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                return dateArray;
            }

            let now = Date.now();
            let endDatePromo = Date.parse(data.endDate);

            let endDate = endDatePromo < now ? endDatePromo : now;
            let startDate = Date.parse(data.startDate);

            let dateArray = await getDates(startDate, endDate);

            let datesArray = new Array();
            for (var i = 0; i < dateArray.length; i++) {
                var date = dateArray[i];
                datesArray.push(date);
            }


            return res.status(200).json(datesArray);

        } catch (error) {
            console.error('Fetch error when retrieving barchar stats');
            console.error(error);
            return res.status(500).json({
                error: error
            });
        }

    },
    /**
 * mainController.generalStats()
 */
    generalStats: async function (req, res) {
        var promoId = req.params.promoId;

        try {
            let response = await fetch('http://localhost:3000/stats/general/promotion/' + promoId, { method: 'GET' });
            let data = await response.json();
            if (response.status !== 200) {
                return res.status(500).json({ response: response });
            }
            return res.status(200).json(data);

        } catch (error) {
            console.error('Fetch error when retrieving general stats');
            console.error(error);
            return res.status(500).json({
                error: error
            });
        }

    },
    /**
     * mainController.showPromotion()
     */
    showPromotion: async function (req, res) {
        var promoId = req.params.promoId;

        try {
            let response = await fetch('http://localhost:3000/promotion/' + promoId, { method: 'GET' });
            let data = await response.json();
            if (response.status !== 200) {
                return res.status(500).json({ response: response });
            }
            return res.status(200).json(data);

        } catch (error) {
            console.error('Fetch error when showing promotion');
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
    /**
     * mainController.createUpdatePromotion()
     */
    createUpdatePromotion: async function (req, res) {

        let promotion = {};
        promotion.promoType = req.cookies.pt; //0=Free,1=Basic,2=Premium 
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
        promotion.companyId = req.cookies.companyId;
        promotion.trollNumber = req.body.trollNumber;
        // if(req.body.shareMessages){
        //    let shareMessages = [];
        //    shareMessages.push(req.body.shareMessages);
        //    promotion.shareMessages= shareMessages;
        //}else{
        //    promotion.shareMessages = undefined;
        // }
        promotion.shareMessages = req.body.shareMessages;
        promotion.facebookTrackingPixel = req.body.facebookTrackingPixel;
        promotion.googleTrackingPixel = req.body.googleTrackingPixel;

        if (req.body.updatePromotionId) {
            promotion.updatePromotionId = req.body.updatePromotionId;
            let updatedPromo = await updatePromotion(promotion);

            if (updatedPromo) {
                console.log('updated promotion: ' + updatedPromo)
                res.status(200).json({ promotionStatus: "updated" });
            } else {
                console.error('Error when updating promotion. ');
                return res.status(500).json({
                    message: 'Error when updating promotion.'
                });
            }
        } else {
            let newPromo = await newPromotion(promotion);

            if (newPromo) {
                res.status(200).json({ promotionStatus: "updated" });
                console.log('created promotion: ' + newPromo)

            } else {
                console.error('Error when creating new promotion. ');
                return res.status(500).json({
                    message: 'Error when creating new promotion.'
                });
            }
        }

    },
    /**
     * mainController.loadPromoImage()
     */
    loadPromoImage: function (req, res) {
        if (!req.files)
            return res.status(400).send('No files were uploaded.');
        let hostname = req.headers.host;
        let userImage = req.files.userfile;

        let modulePath = 'public/images/promo/';
        let imageTitle = 'promo_' + uuidV4();
        var filePathWithoutExt = modulePath + imageTitle;

        Jimp.read(userImage.data).then(function (img) {
            let file = filePathWithoutExt + '.jpg';
            img.scaleToFit(960, 768)
                .quality(85)   // set JPEG quality
                .write(file, () => {
                    return res.status(200).json({ url: hostname + '/' + filePathWithoutExt + '.jpg' });
                }) // save
        }).catch(function (err) {
            console.error('Error when uploading promo. image. ' + err);
            return res.status(500).json({
                message: 'Error when uploading promo. image.',
                error: err
            });
        });

    },
    /**
         * mainController.loadSocialImage()
         */
    loadSocialImage: function (req, res) {
        if (!req.files)
            return res.status(400).send('No files were uploaded.');
        let hostname = req.headers.host;
        let userImage = req.files.userfile;

        let modulePath = 'public/images/social/';
        let imageTitle = 'social_' + uuidV4();
        var filePathWithoutExt = modulePath + imageTitle;

        Jimp.read(userImage.data).then(function (img) {
            let file = filePathWithoutExt + '.jpg';
            img.scaleToFit(1200, 627)
                .quality(80)   // set JPEG quality
                .write(file, () => {
                    return res.status(200).json({ url: hostname + '/' + filePathWithoutExt + '.jpg' });
                }) // save
        }).catch(function (err) {
            console.error('Error when uploading social image. ' + err);
            return res.status(500).json({
                message: 'Error when uploading social image.',
                error: err
            });
        });
    },

    /**
     * mainController.getWinners()
     */
    getWinners: async function (req, res) {
        var promoId = req.params.promoId;


        console.log('Finding winners for promotion: ' + promoId);
        let formData = {};
        try {
            let response = await request.get({ url: 'http://localhost:3000/winner/promotion/' + promoId, form: formData });
            res.status(200).json(response);
        } catch (error) {
            console.error('Fetch error winners. ');
            console.error(error);
            return res.status(500).json({
                error: error
            });
        }


    },

    /**
   * mainController.getParticipants()
   */
    getParticipants: async function (req, res) {
        var promoId = req.params.promoId;


        console.log('Finding Participants for promotion: ' + promoId);
        let formData = {};
        try {
            let response = await request.get({ url: 'http://localhost:3000/participation/promotion/' + promoId + '/full', form: formData });
            res.status(200).json(response);
        } catch (error) {
            console.error('Fetch error participations with full user details. ');
            console.error(error);
            return res.status(500).json({
                error: error
            });
        }


    },

    showAdminDashboard: async function (req, res) {
        var promoId = req.params.promoId;

        let users = await getParticipantsByPromoId(promoId);
        //Dashboard view
        return res.render('admin-dashboard', { title: 'WhatsPromo - Panel de control', users: users });



    }

}
