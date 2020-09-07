var express = require('express');
var router = express.Router();
var path = require('path');
var db = require('../utils/database');
var csv = require('csvtojson');
var mongojs = require('mongojs');
var dbobject1 = mongojs('mongodb://jahnavi:jahnavi@cluster0-shard-00-00-lhkoh.mongodb.net:27017,cluster0-shard-00-01-lhkoh.mongodb.net:27017,cluster0-shard-00-02-lhkoh.mongodb.net:27017/BOT?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority',['ids'])
var TelegramBot = require('node-telegram-bot-api');
var token = '1118107907:AAEDzmT7GIQlT4S33VWU2cNngcqn7KffgoQ';
var bot = new TelegramBot(token, {polling: true});

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/uploadform.html',function(req,res,next){
  res.sendFile(path.join(__dirname,'../public/','uploadform.html'));
});

router.post('/upload',function(req,res,next) {
  var file = req.files.inputfile
  uploadedpath = path.join(__dirname,'../upload/',file.name)
  file.mv(uploadedpath,function(error) {
    if(error) {
      res.render('uploadstatus',{msg:"File upload error"})
    }
    else {
      csv()
      .fromFile(uploadedpath)  // promise operation
      .then(function(jsonarray) {
        var bulk = db.dbobject.students.initializeOrderedBulkOp()
        var count = 0;
        jsonarray.forEach(function(element) {
          bulk.insert(element)
          count = count + 1;
        })
        bulk.execute(function(error) {
          if(error) {
            console.log(error)
          }
          else {
            res.send(count + "CSV datas are loaded successfully")
          }
        })
      })
    }
  })
})

bot.on('message',function(msg){
  var chatid = msg.chat.id;
  db.dbobject.details.find({sid:{$eq:chatid}},function(error,docs){
    if(error){
      console.log(error)
    }
    else{
      var fid = docs[2];
      bot.sendMessage(fid,msg.text);
    }
  })
});

module.exports = router;
