"use strict"
const express = require('express')
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser')
const cors = require('cors')
const account_creation_individual = require('./routes/API/account_creation_individual')
const account_creation_IRA = require('./routes/API/account_creation_IRA')
const customSetup = require('./routes/api/customSetup')
const confluence_tickets = require('./routes/api/confluence_tickets');
const loginAutehntication = require('./routes/api/loginAutehntication');
const customSetupNotes = require('./routes/api/customSetupNotes');
const fs = require('fs');
const _ = require('underscore');
/* Reading all account from json file DB */


/* Get all modules together  */
app.use(bodyParser.json())
app.use(cors());
app.use('/api/account_creation_individual', account_creation_individual);
app.use('/api/account_creation_IRA', account_creation_IRA);
app.use('/customSetup', customSetup);
app.use('/confluence_tickets', confluence_tickets);
app.use('/customSetupNotes', customSetupNotes);
app.use('/loginAutehntication', loginAutehntication);


app.post('/', (req, res) => {
    //First verification for username and auth key    
    console.log('fart')  
    if (req.body.account !== undefined && req.body.account !== '') {
        let  accountIP = req.body.account;
        var fileState = fs.readFileSync('./routes/API/accounts.json');
        var dbAccounts = JSON.parse(fileState);
        console.log('Account is login ' + accountIP);
        let accountIpsend = {"accountIP":accountIP};
        //Send only values with data
       if (accountIP in dbAccounts) { 
           for(setup in dbAccounts[accountIP].setups){
               if(dbAccounts[accountIP].setups[setup] !='' && dbAccounts[accountIP].setups[setup] != undefined){ 
                   console.log(`"${setup}":${JSON.stringify(dbAccounts[accountIP].setups[setup])},`)              
                res.write(`"${setup}":${JSON.stringify(dbAccounts[accountIP].setups[setup])},`);
               }       

           }

           
        } else {
            //Account is not exist - Creating Setups
          console.log('account is not exist')
          dbAccounts[accountIP]={}
          dbAccounts[accountIP].setups={};
          dbAccounts[accountIP].setups["customButton_name_one"]= "";
          dbAccounts[accountIP].setups["customButton_link_one"]= "";
          dbAccounts[accountIP].setups["customButton_name_two"]= "";
          dbAccounts[accountIP].setups["customButton_link_two"]= "";
          fs.writeFileSync('./routes/API/accounts.json',JSON.stringify(dbAccounts));
          res.write(JSON.stringify(dbAccounts[accountIP].setups));

        }
        res.write(JSON.stringify(accountIpsend));
        res.end()  
      
    }else res.write("Something went wrong", function (err) { res.end() })
})

app.listen(port, console.log('server is on'));




//Login with cookies

/* if (req.body.account !== undefined && req.body.account !== '' && req.body.account[0] !== '') {
        //reading DB file and getting all information
        var fileState = fs.readFileSync('./routes/API/accounts.json');
        var dbAuthKey = JSON.parse(fileState);
        
        //getting information from cookies and dividing on USername and AuthKey
        var reqSplit = req.body.account.split('=');
        var cookieAuthKey = reqSplit[1]
        var iter = reqSplit[0];

        //Saving to object for match up verification
        var verKey = {};
        verKey[iter] = cookieAuthKey;

        //Print in Console main verification variables
        console.log(`\tDB values `);
        console.log(dbAuthKey.accounts);
        console.log(`\tCokkies values `);
        console.log(verKey);
        console.log('\t\tdoes Creadentials match to DB ' + _.isMatch(dbAuthKey.accounts, verKey));

        //Check if account exists in DB and send respond with AUTH key
        if (_.isMatch(dbAuthKey.accounts, verKey)) {
            res.write(JSON.stringify(dbAuthKey), function (err) { res.end() })
        }

    }
    //Username creation process
    if (req.body.username !== undefined) {
        // reading the file and username from request
        var fileState = fs.readFileSync('./routes/API/accounts.json');
        var jsonDB = JSON.parse(fileState);
        var dbAuthKey = JSON.parse(fileState);
        var accountCreation = req.body.username;

        //Creating new object with existing cookies
        var verKey = {};
        verKey[accountCreation] = req.body.cookie;

        //checking if username exists with no Auth key  when user enters on login page account with already existing cookies      
        console.log(verKey)
        
        if (_.isMatch(dbAuthKey.accounts, verKey)) {


        } else {
            //generating UUID code
            var code = function generateUUID() {
                var d = new Date().getTime();
                var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                });

                return uuid;

            }
            jsonDB.accounts ={}
            //applying code to new username
            jsonDB.accounts[accountCreation] = code();
            jsonDB.setups[accountCreation] ={}
            console.log(`Creating new account for `)
            console.log('\t' + accountCreation + '_' + jsonDB.accounts[accountCreation])

            //saving new account in DB
            fs.writeFileSync('./routes/API/accounts.json', JSON.stringify(jsonDB), function (err) {
                console.log(err)

            });
            //send the responce with Username and Auth key
            res.write(accountCreation + '_' + jsonDB.accounts[accountCreation], function (err) { res.end() });
        }


    }
 */

