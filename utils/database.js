var mongojs = require('mongojs');
var dbobject = mongojs('mongodb://jahnavi:jahnavi@cluster0-shard-00-00-lhkoh.mongodb.net:27017,cluster0-shard-00-01-lhkoh.mongodb.net:27017,cluster0-shard-00-02-lhkoh.mongodb.net:27017/BOT?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority',['details'])

module.exports.dbobject=dbobject;