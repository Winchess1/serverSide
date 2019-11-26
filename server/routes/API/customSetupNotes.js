"use strict"
const express = require('express');
const router = express.Router();

//Creating Redis DB
const redis = require('redis');
const db = redis.createClient();

//Connecting DB to the server
db.on('connect', () => console.log('Notes and Tickets are connected to Redis DB'));
db.on('ready', () => console.log('Redis is Ready'));
db.on('error', err => console.log('Redis is on error', err));

router.post('/',(req,res)=>{ 
  let ticketNote ={};
  let accountName = req.body.accountName;
  let noteKeys = Object.keys(req.body); 
  console.log(noteKeys);
  for (let i of noteKeys){
    if( req.body[i] != undefined &&  req.body[i] !='')
      ticketNote[i] = req.body[i];
      console.log(req.body[i]);
  } 
  delete ticketNote.accountName;
  console.log(ticketNote);
  //Checking if Account exist and save button names and links in the Object
  db.exists(accountName, function (err, reply) {
    if (reply === 1) {
      console.log('exists');
      
      db.hmset(accountName, ticketNote)
    } else {
      console.log('doesn\'t exist');
    }
  });

})

module.exports = router;


