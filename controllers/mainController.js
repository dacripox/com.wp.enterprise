let fetch = require('isomorphic-fetch');
var mobileDetect = require('mobile-detect');


/**
 * mainController.js
 *
 * @description :: Server-side logic.
 */
module.exports = {
    /**
     * mainController.showMainIndex()
     */
    showMainIndex: function (req, res) {
        var promoId = req.params.promoId;
        var refFriend = req.params.refFriend;

      
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
        res.render('desktop-version', { title: 'No title' });
    }


}
