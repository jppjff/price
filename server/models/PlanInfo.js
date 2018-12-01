var db = require('diskdb');
db = db.connect('server/data',['PlanInfo']);

module.exports = db.PlanInfo;