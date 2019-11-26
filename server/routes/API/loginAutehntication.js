"use strict"
/* Reading all account from json file DB */
const express = require('express');
const router = express.Router();
//Creating Redis DB
const redis = require('redis');
const db = redis.createClient();
//Connecting DB to the server
db.on('connect', () => console.log('Redis is on'));
db.on('ready', () => console.log('Redis is Ready'));
db.on('error', err => console.log('Redis is on error', err));

//Getting all accounts in the DB
db.keys('*', function (err, reply) {
  console.log(reply);
});

router.post('/', (req, res) => {
  //Gettin all variables from a request
  let accountName = req.body.accountName;
  let buttonNames = Object.keys(req.body);
  let accountContent = {}
  //saving all in the Object
  for (let i of buttonNames) {
    accountContent[i] = req.body[i];
  }

  console.log('\t Account content before base')
  console.log(accountContent);

  //Connecting to the DB
  db.exists(accountName, function (err, reply) {
    if (reply === 1) {
      console.log('exists');
      //If account exists get all account Information
      db.hgetall(accountName, function (err, obj) {
        console.log('\t Account content from db')
        console.dir(obj);
        //Send account and setups to the front end
        res.json({ obj, accountName: accountName });
      });
    } else {
      console.log('doesn\'t exist');
      //create Cookies
      accountContent['cookies'] = generateUUID();
      console.log('\t Account content')
      console.log(accountContent);
      //IF account doesn't exist add it to the DB
      db.hmset(accountName, accountContent);
      //Send account and setups to the front end
      res.json({ accountName: accountName, cookies: accountContent.cookies })
    }

  });

  //Cookies generator
  function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }
});


module.exports = router;




