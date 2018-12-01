var Queue = require('better-queue');

var sleep = require('system-sleep');
var PlanInfo = require('../models/PlanInfo.js');
var UserSubscription = require('../models/UserSubscription.js');
var ImpactUserNotice = require('../models/ImpactUserNotice.js');

var FindImpactUser = new Queue(function (newPrice, cb) {
    sleep(1000);    
    var planID = newPrice.planID;
    var price = newPrice.newPrice;
    var plan = PlanInfo.find({ planID: planID })[0];
    var currency = plan.currency;    
    var userImpacted = UserSubscription.find({ planID: planID });
    for (var i in userImpacted) {
        var user = userImpacted[i];
        var impactUserItem = {
            userID: user.userID,
            planID: plan.planID,
            newPrice: price,
            currency: currency
        }        
        ImpactUserNotice.update(
            { userID: user.userID },
            impactUserItem,
            { upsert: true }
        )
    }
    
    cb();
});
module.exports = FindImpactUser;