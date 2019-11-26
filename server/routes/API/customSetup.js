"use strict"
const express = require('express');
const router = express.Router();
//Creating Redis DB
const redis = require('redis');
const db = redis.createClient();
//Connecting DB to the server
db.on('connect', () => console.log('Redis is on'));
db.on('ready', () => console.log('Redis is Ready'));
db.on('error', err => console.log('Redis is on error', err));


router.post('/', (req, res) => {
  //Variables from request
  let accountName = req.body.accountName;
  let buttonKeys = Object.keys(req.body);
  let customContent = {};

  //Saving the data to object
  for (let i of buttonKeys) {
    customContent[i] = req.body[i];
  }
  //removing Account Name from Object 
  delete customContent.accountName;

  //Checking if Account exist and save button names and links in the Object
  db.exists(accountName, function (err, reply) {
    if (reply === 1) {
      console.log('exists');
      console.log(customContent);
      db.hmset(accountName, customContent)
    } else {
      console.log('doesn\'t exist');
    }
  });
})

module.exports = router;


