var db = require('diskdb');
db = db.connect('server/data',['ImpactUserNotice']);

module.exports = db.ImpactUserNotice;