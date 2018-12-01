var db = require('diskdb');
db = db.connect('server/data',['UserSubscription']);

module.exports = db.UserSubscription;