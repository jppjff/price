// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const fs = require('fs');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();

var PlanInfo = require('./server/models/PlanInfo.js');
var UserSubscription = require('./server/models/UserSubscription.js');
var ImpactUserNotice = require('./server/models/ImpactUserNotice.js');
var FindImpactUser = require('./server/jobs/FindImpactUser.js');
// middleware to use for all requests

router.use(function (req, res, next) {    
    next(); 
});

router.get('/', function (req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here
router.route('/planInfo')
    .get(function (req, res) {
        res.json(PlanInfo.find());
    })
    .put(function (req, res) {
        res.json(PlanInfo.update({
            planID: req.body.planID
        }, req.body));
    });

router.route('/userSubscription')
    .get(function (req, res) {
        res.json(UserSubscription.find());
    });

router.route('/priceChange/:plan_id/:new_price')
    .get(function (req, res) {
        var pid = req.params.plan_id;
        var nprice = req.params.new_price;
        var planCollection = PlanInfo.find({ planID: pid });

        if (planCollection.length === 0) {
            res.json({
                'errorCode': 1,
                'errorMsg': 'PlanID not found'
            });
        }
        else {
            var plan = planCollection[0];
            if (isNaN(nprice) || nprice <= 0) {
                res.json({
                    'errorCode': 2,
                    'errorMsg': 'Invalid Price'
                });
            }
            else if (plan.amount == nprice) {
                res.json({
                    'errorCode': 3,
                    'errorMsg': 'New price = Old Price'
                });
            }
            else {
                plan.amount = nprice;
                var result = PlanInfo.update({
                    planID: pid
                }, plan);

                FindImpactUser.push({
                    planID: pid,
                    newPrice: nprice
                });

                result['task'] = 'A task is created to process impacted user, please find it at /api/queue';
                res.json(result);
            }
        }


    });

router.route('/queue')
    .get(function (req, res) {
        res.json(FindImpactUser.getStats());
    });

router.route('/impactList')
    .get(function (req, res) {
        res.json(ImpactUserNotice.find());
    });

router.route('/client/:user_id')
    .get(function (req, res) {
        var uid = req.params.user_id;
        var user = ImpactUserNotice.find({ userID: uid });
        if (user.length != 0) {
            res.json('You need to confirm if you want to continue with ' + user[0].newPrice);
        }
        else {
            res.json('You are not affected');
        }

    });

router.route('/reset')
    .get(function (req, res) {
        try {
            var PlanInfoSample = fs.readFileSync('server/data/PlanInfo-sample.json', 'utf8');
            var UserSubscriptionSample = fs.readFileSync('server/data/UserSubscription-sample.json', 'utf8');
            fs.writeFileSync('server/data/ImpactUserNotice.json', '[]');
            fs.writeFileSync('server/data/PlanInfo.json', PlanInfoSample);
            fs.writeFileSync('server/data/UserSubscription.json', UserSubscriptionSample);
            res.json('Done');
        }
        catch (error) {
            res.json(error);
        }
    });
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Started at: ' + port);
module.exports = app