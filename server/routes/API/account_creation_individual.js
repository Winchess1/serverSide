"use strict"
const express = require('express');
const router = express.Router();
const request = require('request');

router.post('/', (req, res) => {
  const jarcookie = request.jar();
  let addCookie = request.jar();
  console.log(req.body.environmentName);
  console.log(req.body.accountType);
  console.log(req.body);
  let steX = req.body.environmentName;
  let consoleRespond = '';
  let accountNumber = '';

  //First request to get Auth token 
  request({ jar: jarcookie, url:`https://start-${steX}.tdameritrade.com/select`},
    (err, resp, body) => {
      let headerTokens = {};
      let cookie_string = jarcookie.getCookieString(`https://start-${steX}.tdameritrade.com/select`);
      headerTokens['x-auth-token'] = resp.headers['x-auth-token'];
      headerTokens['x-correlation-id'] = resp.headers['x-correlation-id'];
      consoleRespond += ` Connection established - ${resp.statusCode}  \n`;
      console.log("\t tokens and id's are saved");
      console.log(headerTokens);
      mainReuqest(headerTokens);
    });
//Main request to Post and get account 
  var mainReuqest = function mainReuqest(headerTokens) {
    request({
      url: 'https://start-' + steX + '.tdameritrade.com/api/applications ',
      method: 'POST',
      headers: { "Content-Type": "application/json;charset=UTF-8", 'x-auth-token': headerTokens['x-auth-token'], 'x-correlation-id': headerTokens['x-correlation-id'] },
      body: "{\"accountApplication\":{\"owners\":{\"primaryOwner\":{\"clientAgreement\":true,\"w9AccuracyCertification\":true,\"isPrimaryOwner\":true,\"accountType\":\"INDIVIDUAL_BROKERAGE_ACCOUNT\",\"useDifferentMailingAddress\":false,\"citizenship\":{\"isUsCitizen\":true,\"isUsDualCitizen\":false},\"physicalAddress\":{\"country\":\"UNITED STATES\",\"addressLine1\":\"818 GOVERNMENT\",\"city\":\"CHICAGO\",\"state\":\"IL\",\"zip\":\"60090\"},\"email\":\"NPE-QAWebTest@tdameritrade.com\",\"name\":{\"firstName\":\"Peter\",\"middleName\":\"F\",\"lastName\":\"Diglet\"},\"dob\":\"1998-06-19\",\"primaryPhone\":{\"phoneNumber\":\"1234567890\"},\"ssn\":\"666101500\",\"employment\":{\"status\":\"HOMEMAKER\"},\"financialInfo\":{\"annualIncome\":\"INCOME_25000_TO_49999\",\"netWorth\":\"NETWORTH_15000_TO_49999\",\"liquidNetWorth\":\"NETWORTH_15000_TO_49999\"},\"personalAffiliations\":{\"affiliationCorporate\":{\"status\":\"No\"},\"affiliationFinra\":{\"status\":\"No\"}},\"sourceOfFunding\":{\"initial\":{\"standard\":\"Inheritance/trust\"},\"ongoing\":{\"standard\":\"Savings\"}}}},\"accountType\":\"INDIVIDUAL_BROKERAGE_ACCOUNT\",\"isIRAAccount\":false,\"isPrefillUser\":false,\"flowName\":\"single\",\"isJointAccount\":false,\"cashSweep\":\"FDIC_INSURED_DEPOSIT\",\"investmentStyle\":\"BUY_AND_HOLD\",\"privacyStatementAgreement\":true},\"generateAccountNumber\":true}"
    }, (err, resp, body) => {
      consoleRespond += 'Main request is completed ' + resp.statusCode + '\n';
      console.log('\x1b[36m%s\x1b[0m', 'Main request is completed ' + resp.statusCode);
      accountNumber = JSON.parse(resp.body).accountNumber;
      verification(resp.body, accountNumber, headerTokens);
    });
  }

  var verification = function verification(respBody, accountNumber, headerTokens) {
    request({
      url: 'https://start-' + steX + '.tdameritrade.com/api/verifyApplication',
      method: 'POST',
      headers: { "Content-Type": "application/json;charset=UTF-8", 'x-auth-token': headerTokens['x-auth-token'], 'x-correlation-id': headerTokens['x-correlation-id'] },
      body: respBody
    }, (err, resp, body) => {
      consoleRespond += 'Account Verification is completed ' + resp.statusCode + '\n';
      console.log('\x1b[36m%s\x1b[0m', 'Account Verification is completed ' + resp.statusCode);
      promotion(respBody, accountNumber, headerTokens);
    });
  }


  var promotion = function promotion(respBody, accountNumber, headerTokens) {
    request({
      url: 'https://start-' + steX + '.tdameritrade.com/api/promotion',
      method: 'POST',
      headers: { "Content-Type": "application/json;charset=UTF-8", 'x-auth-token': headerTokens['x-auth-token'], 'x-correlation-id': headerTokens['x-correlation-id'] },
      body: respBody
    }, (err, resp, body) => {
      consoleRespond += 'Account Promotion is completed ' + resp.statusCode + '\n';
      console.log('\x1b[36m%s\x1b[0m', 'Account Promotion is completed  ' + resp.statusCode);
      credentials(accountNumber, headerTokens);
    });
  }

  var credentials = function credentials(accountNumber, headerTokens) {
    request({
      url: 'https://start-' + steX + '.tdameritrade.com/api/credentials',
      method: 'POST',
      headers: { "Content-Type": "application/json;charset=UTF-8", 'x-auth-token': headerTokens['x-auth-token'], 'x-correlation-id': headerTokens['x-correlation-id'] },
      body: "{\"userID\":\"tst" + accountNumber + "\",\"password\":\"test9033\",\"reenterPassword\":\"test9033\",\"description\":\"BRUCE E SMITH\",\"mothersMaidenName\":\"Primary Mother\",\"CH0\":\"What is your maternal grandmother's first name?\",\"CH1\":\"What was the first name of your first manager?\",\"CH2\":\"In what city were you born? (Enter full name of city only.)\",\"CH3\":\"Where did you meet your spouse for the first time? (Enter full name of city only.)\",\"answer0\":\"test9033\",\"answer1\":\"test9033\",\"answer2\":\"test9033\",\"answer3\":\"test9033\",\"screenResolution\":\"24|1440|900|872\",\"systemLanguage\":\"lang=en-US|syslang=|userlang=\",\"GMTOffset\":\"-5\",\"isJavaInstalled\":\"0\",\"flashVersion\":\"0.0.0\",\"areFlashCookiesEnabled\":\"1\",\"installedSoftware\":\"\"}"
    }, (err, resp, body) => {
      consoleRespond += 'Account Credentials is completed ' + resp.statusCode + '\n';
      console.log('\x1b[36m%s\x1b[0m', 'Account Credentials is completed ' + resp.statusCode);
      console.log('Account number', accountNumber);
      let SSO = JSON.parse(resp.body).tokenData['olaToken'];
      ssoTokenLink(SSO);

    });
  }

  var ssoTokenLink = function ssoTokenLink(ssotoken) {
    request({
      url: 'https://invest-' + steX + '.tdameritrade.com/grid/m/__ola/sso?token=' + ssotoken,
      method: 'GET',
      jar: addCookie,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }, (err, resp, body) => {
      var postpromo_dv_data = addCookie.getCookieString('https://invest' + steX + '.tdameritrade.com/grid/m/__ola/sso?token=' + ssotoken);
      console.log('\x1b[97m%s\x1b[0m', 'New cookies were created')
      console.log(postpromo_dv_data);
      //console.log(resp);
      completeApplication(postpromo_dv_data);

    });
  }

  var completeApplication = function completeApplication(postpromo_cookies) {
    request({
      url: 'https://invest-' + steX + '.tdameritrade.com/grid/p/completeApplication',
      method: 'GET',
      headers: { "Content-Type": "application/json;charset=UTF-8", "Cookie": postpromo_cookies, },
      body: "mAction=securityconfirmsubmit&moduleId=__ola%2FsecurityConfirm-1&xhrToken=true&dojo.preventCache=1564077056774"
    }, (err, resp, body) => {
      var transToken = (body.slice(body.search('transactionToken'), body.search('transactionToken') + 39)).replace(/(.*?):'(.*?)'.*/, '$1=$2');
      console.log(transToken)
      consoleRespond += 'securityConfirm step is completed ' + resp.statusCode + '\n';
      console.log('\x1b[36m%s\x1b[0m', '__ola/securityConfirm step is completed - ' + resp.statusCode);
      funding(postpromo_cookies, transToken);

    });
  }


  var funding = function funding(postpromo_cookie_string, transToken) {
    request({
      url: 'https://invest-' + steX + '.tdameritrade.com/grid/m/__ola/funding',
      method: 'POST',
      headers: { "Content-Type": "application/x-www-form-urlencoded", "Cookie": postpromo_cookie_string },
      body: "mAction=save&\
    dijit_layout_TabContainer_0_tablist_recommendedFundingMethods=&\
    dijit_layout_TabContainer_0_tablist_allFundingMethods=&\
    fundingMethod=EXP&\
    moduleId=__ola%2Ffunding-1&\
   " + transToken + "&\
    xhrToken=true&\
    dojo.preventCache=1564077119579"
    }, (err, resp, body) => {
      consoleRespond += '__ola/funding - ' + resp.statusCode + '\n';
      console.log('\x1b[36m%s\x1b[0m', '__ola/funding - ' + resp.statusCode);

      fundingExpressEntry(postpromo_cookie_string, transToken);

    });

  }

  var fundingExpressEntry = function fundingExpressEntry(postpromo_cookie_string, transToken) {
    request({
      url: 'https://invest-' + steX + '.tdameritrade.com/grid/m/__ola/fundingExpressEntry',
      method: 'POST',
      headers: { "Content-Type": "application/x-www-form-urlencoded", "Cookie": postpromo_cookie_string },
      body: "primaryOwnerSelected=true&\
    bankAccountType=0&\
    depositAmount="+ req.body.fundings + "&\
    abaNumber=122105278&\
    bankAccountNumber=0000000008&\
    abaNumberConfirm=122105278&\
    bankAccountNumberConfirm=0000000008&\
    bankName=Bank%20Of%20America&\
    bankCity=Chicago&\
    bankState=IL&\
    bankNickname=test&\
    moduleId=__ola%2FfundingExpressEntry-1&\
    "+ transToken + "&\
    xhrToken=true&\
    dojo.preventCache=1564077303863"
    }, (err, resp, body) => {
      consoleRespond += '__ola/fundingExpressEntry - ' + resp.statusCode + '\n';
      console.log('\x1b[36m%s\x1b[0m', '__ola/fundingExpressEntry - ' + resp.statusCode);
      fundingExpressReview(postpromo_cookie_string, transToken);

    });

  }


  var fundingExpressReview = function fundingExpressReview(postpromo_cookie_string, transToken) {
    request({
      url: 'https://invest-' + steX + '.tdameritrade.com/grid/m/__ola/fundingExpressReview',
      method: 'POST',
      headers: { "Content-Type": "application/x-www-form-urlencoded", "Cookie": postpromo_cookie_string },
      body: "mAction=save&\
    bankRetry=false&\
    primaryOwnerSelected=true&\
    depositAmount="+ req.body.fundings + "&\
    bankName=Bank%20Of%20America&\
    bankCity=Chicago&\
    bankState=IL&\
    abaNumber=122105278&\
    bankAccountType=0&\
    bankAccountNumber=0000000008&\
    bankNickname=test&\
    agreeTerms=true&\
    moduleId=__ola%2FfundingExpressReview-1&\
    "+ transToken + "&\
    xhrToken=true&\
    dojo.preventCache=1564077335395"
    }, (err, resp, body) => {
      consoleRespond += '__ola/fundingExpressReview - ' + resp.statusCode + '\n';
      console.log('\x1b[36m%s\x1b[0m', '__ola/fundingExpressReview - ' + resp.statusCode);
      fundingExpressConfirm(postpromo_cookie_string, transToken);

    });

  }


  var fundingExpressConfirm = function fundingExpressConfirm(postpromo_cookie_string, transToken) {
    request({
      url: 'https://invest-' + steX + '.tdameritrade.com/grid/m/__ola/fundingExpressConfirm',
      method: 'POST',
      headers: { "Content-Type": "application/x-www-form-urlencoded", "Cookie": postpromo_cookie_string },
      body: "mAction=save&moduleId=__ola%2FfundingExpressConfirm-1&" + transToken + "&xhrToken=true&dojo.preventCache=1564077388529"
    }, (err, resp, body) => {
      consoleRespond += '__ola/fundingExpressConfirm - ' + resp.statusCode + '\n';
      console.log('\x1b[36m%s\x1b[0m', '__ola/fundingExpressConfirm - ' + resp.statusCode);
      optionMarginEntry(postpromo_cookie_string, transToken);
    });

  }


  var optionMarginEntry = function optionMarginEntry(postpromo_cookie_string, transToken) {
    request({
      url: 'https://invest-' + steX + '.tdameritrade.com/grid/m/__ola/optionMarginEntry',
      method: 'POST',
      headers: { "Content-Type": "application/x-www-form-urlencoded", "Cookie": postpromo_cookie_string },
      body: "mAction=save&tradingFeature3=true&moduleId=__ola%2FoptionMarginEntry-1&" + transToken + "&xhrToken=true&dojo.preventCache=1564078018020"
    }, (err, resp, body) => {
      consoleRespond += '__ola/__ola/optionMarginEntry - ' + resp.statusCode + '\n';
      console.log('\x1b[36m%s\x1b[0m', '__ola/__ola/optionMarginEntry - ' + resp.statusCode);
      deliveryPreferences(postpromo_cookie_string, transToken);
    });

  }


  var deliveryPreferences = function deliveryPreferences(postpromo_cookie_string, transToken) {
    request({
      url: 'https://invest-' + steX + '.tdameritrade.com/grid/m/__ola/deliveryPreferences',
      method: 'POST',
      headers: { "Content-Type": "application/x-www-form-urlencoded", "Cookie": postpromo_cookie_string },
      body: "mAction=save&okTOShare=true&stmtDeliveryMethod=E&confirmsDeliveryMethod=E&taxDocumentDeliveryMethod=E&confirmDeliveryPreferences=true&moduleId=__ola%2FdeliveryPreferences-1&" + transToken + "&xhrToken=true&dojo.preventCache=1565895546425"
    }, (err, resp, body) => {
      consoleRespond += '__ola/deliveryPreferences - ' + resp.statusCode + '\n';
      console.log('\x1b[36m%s\x1b[0m', '__ola/deliveryPreferences - ' + resp.statusCode);
      trustedContacts(postpromo_cookie_string, transToken);
    });

  }

  var trustedContacts = function trustedContacts(postpromo_cookie_string, transToken) {
    request({
      url: 'https://invest-' + steX + '.tdameritrade.com/grid/m/__ola/trustedContacts',
      method: 'POST',
      headers: { "Content-Type": "application/x-www-form-urlencoded", "Cookie": postpromo_cookie_string },
      body: "mAction=save&\
    secondTCExists=false&\
    provideTrustedContact=false&\
    namePrefix1=&\
    firstName1=&\
    middleName1=&\
    lastName1=&\
    nameSuffix1=&\
    relationship1=&\
    phone1=&\
    email1=&\
    country1=UNITED%20STATES&\
    street11=&\
    street21=&\
    city1=&\
    state1=&\
    canadianProvince1=&\
    province1=&\
    postalCode1=&\
    namePrefix2=&\
    firstName2=&\
    middleName2=&\
    lastName2=&\
    nameSuffix2=&\
    relationship2=&\
    phone2=&\
    email2=&\
    country2=UNITED%20STATES&\
    street12=&\
    street22=&\
    city2=&\
    state2=&\
    canadianProvince2=&\
    province2=&\
    postalCode2=&\
    moduleId=__ola%2FtrustedContacts-1&\
    "+ transToken + "&\
    xhrToken=true&\
    dojo.preventCache=1564078165384"
    }, (err, resp, body) => {
      consoleRespond += '__ola/trustedContacts - ' + resp.statusCode + '\n';
      console.log('\x1b[36m%s\x1b[0m', '__ola/trustedContacts - ' + resp.statusCode);
      exchangeAgreements(postpromo_cookie_string, transToken);
    });

  }


  var exchangeAgreements = function exchangeAgreements(postpromo_cookie_string, transToken) {
    request({
      url: 'https://invest-' + steX + '.tdameritrade.com/grid/m/__ola/exchangeAgreements',
      method: 'POST',
      headers: { "Content-Type": "application/x-www-form-urlencoded", "Cookie": postpromo_cookie_string },
      body: "mAction=save&nonProfessional=&signupRealtimeQuotes=false&jobTitle=&jobFunction=&crdNumber=&moduleId=__ola%2FexchangeAgreements-1&" + transToken + "&xhrToken=true&dojo.preventCache=1564078189148"
    }, (err, resp, body) => {
      consoleRespond += '__ola/exchangeAgreements - ' + resp.statusCode + '\n';
      console.log('\x1b[36m%s\x1b[0m', '__ola/exchangeAgreements - ' + resp.statusCode);
      cashManagement(postpromo_cookie_string, transToken);
    });

  }


  var cashManagement = function cashManagement(postpromo_cookie_string, transToken) {
    request({
      url: 'https://invest-' + steX + '.tdameritrade.com/grid/m/__ola/cashManagement',
      method: 'POST',
      headers: { "Content-Type": "application/x-www-form-urlencoded", "Cookie": postpromo_cookie_string },
      body: "mAction=save&interestedInDebitCards=true&interestedInChecking=true&interestedInBillPay=true&interestedInCreditCards=true&moduleId=__ola%2FcashManagement-1&" + transToken + "&xhrToken=true&dojo.preventCache=1564078216101"
    }, (err, resp, body) => {
      consoleRespond += '__ola/cashManagement - ' + resp.statusCode + '\n';
      consoleRespond += 'done'
      console.log('\x1b[36m%s\x1b[0m', '__ola/cashManagement - ' + resp.statusCode);
      console.log('Request is completed')
    });
    console.log(accountNumber);
    res.write(accountNumber);
    res.end();
  }

});

module.exports = router;