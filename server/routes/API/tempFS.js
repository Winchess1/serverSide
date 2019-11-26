// This code sample uses the 'request' library:
// https://www.npmjs.com/package/request
var request = require('request');
const axios = require('axios')

const jarcookie = request.jar();
const fartcookie = request.jar();

request({
    method: 'get',
         
    url: 'https://confluence.associatesys.local/plugins/servlet/external-login',
    headers: {
        "content-type": "application/json"
    },
    jar: jarcookie,
    rejectUnauthorized:false,
},
    function (error, response, body) {
        if (error) throw new Error(error);
        console.log(
            'Response: ' + response.statusCode + ' ' + response.statusMessage
        );
        cookie_string = jarcookie.getCookieString('https://confluence.associatesys.local/plugins/servlet/external-login');
        console.log('Getting cookie ', cookie_string +'; amlbcookie=01');
        
        OATH(cookie_string)
    });

function OATH(cookie_string){  
                                        
    request({
      url: 'https://access.tdameritrade.com/authservice/SSOPOST/metaAlias/associates/idp?ReqID=ONELOGIN_9c6618b5-c9d6-4172-8c42-de00b49f2102&index=null&acsURL=https://confluence.associatesys.local/plugins/servlet/samlconsumer&spEntityID=https://confluence.associatesys.local&binding=urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',
      method: 'POST',
      auth: {
        user: 'kne161',
        pass: 'Shaman234wer'
      },
      
      form: {
        grant_type: 'client_credentials',
        
      },
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
        "Cookie": cookie_string,
        
    },
    }, function(err, res) {
        console.log(res);
      console.log(res.statusCode);
    });

}



function serverInfo(cookie_string) {
    request({
        method: 'POST',
        url: 'https://access.tdameritrade.com/authservice/json/realms/root/realms/associates/authenticate?forward=true&spEntityID=https://confluence.associatesys.local&goto=/authservice/SSOPOST/metaAlias/associates/idp?ReqID%3DONELOGIN_9c6618b5-c9d6-4172-8c42-de00b49f2102%26index%3Dnull%26acsURL%3Dhttps://confluence.associatesys.local/plugins/servlet/samlconsumer%26spEntityID%3Dhttps://confluence.associatesys.local%26binding%3Durn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST&AMAuthCookie=',
        headers: {
            "content-type": "application/json;charset=UTF-8",
            "Cookie": cookie_string,
            'user-agent': 'node.js'
        },
        rejectUnauthorized:false,
        
    },
        function (error, response, body) {
            if (error) throw new Error(error);
             console.log(
                 'Server Info  ' + response.statusCode + ' ' + response.statusMessage
             );
            // console.log(response)


        });
  //  authId(cookie_string)
}

function authId(cookie_string) {

axios({
    method: 'post',
    url: 'https://access.tdameritrade.com/authservice/json/users?_action=idFromSession',
    headers: {
        "content-type": "application/json;charset=UTF-8",
        "Cookie": cookie_string,
        'user-agent': 'node.js'
    },
    rejectUnauthorized:false,
        json:true,
  }).then(function (response) {
    console.log(response)
  });
}
/* 
function authId(cookie_string) {
    request({
        method: 'POST',
        url: 'https://access.tdameritrade.com/authservice/json/realms/root/realms/associates/authenticate?forward=true&spEntityID=https://confluence.associatesys.local&goto=/authservice/SSOPOST/metaAlias/associates/idp?ReqID%3DONELOGIN_a8c1b38b-26da-4c9a-8b63-76da5e730dd6%26index%3Dnull%26acsURL%3Dhttps://confluence.associatesys.local/plugins/servlet/samlconsumer%26spEntityID%3Dhttps://confluence.associatesys.local%26binding%3Durn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST&AMAuthCookie=',
       //     https://access.tdameritrade.com/authservice/XUI/?realm=            /associates&             forward=true&spEntityID=https://confluence.associatesys.local&goto=            /SSOPOST/metaAlias/associates/idp?ReqID%3DONELOGIN_a8c1b38b-26da-4c9a-8b63-76da5e730dd6%26index%3Dnull%26acsURL%3Dhttps://confluence.associatesys.local/plugins/servlet/samlconsumer%26spEntityID%3Dhttps://confluence.associatesys.local%26binding%3Durn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST&AMAuthCookie=
           //   https://access.tdameritrade.com/authservice/json/realms/root/realms/associates/authenticate?forward=true&spEntityID=https://confluence.associatesys.local&goto=/authservice/SSOPOST/metaAlias/associates/idp?ReqID%3DONELOGIN_a8c1b38b-26da-4c9a-8b63-76da5e730dd6%26index%3Dnull%26acsURL%3Dhttps://confluence.associatesys.local/plugins/servlet/samlconsumer%26spEntityID%3Dhttps://confluence.associatesys.local%26binding%3Durn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST&AMAuthCookie= 
       headers: {
            "content-type": "application/json;charset=UTF-8",
            "Cookie": cookie_string,
            'user-agent': 'node.js'
        },
        rejectUnauthorized:false,
        json:true,
       // body:{"failure":true,"reason":"http-auth-failed","authId":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJvdGsiOiJyN2NncnVlZWYxcHRscnVvZzBuanIwcHZrMSIsInJlYWxtIjoiL2Fzc29jaWF0ZXMiLCJzZXNzaW9uSWQiOiJfMUhFQmVMMnBudUZvV2VmWTl1YW11aWVfWmsuKkFBSlRTUUFDTURFQUFsTkxBQngzYzFOV00yWTJkVWRIZEZaTFNqSXdNbFJvTVc1TWVuUm1XVms5QUFSMGVYQmxBQWxKVGw5TlJVMVBVbGtBQWxNeEFBQS4qIn0.hmpAepthYpySbRRLSRk1LR4oawR2n_treo4EO--Rp0M"}

    },
        function (error, response, body) {
            if (error) throw new Error(error);
            console.log('Auth key request ', response.body);
            console.log(response);
            console.log(body);
            console.log(
                'Response: ' + response.statusCode + ' ' + response.statusMessage
            );


        });

}
 */



/*
 body:{
    "authId": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJvdGsiOiJrdnRuMDY3am5oNnJtYXZvcTFtcGJsNm1rdCIsInJlYWxtIjoiL2Fzc29jaWF0ZXMiLCJzZXNzaW9uSWQiOiJKOG15cnVTY0daaEkwTmtQeE54OVdWVmkxOVUuKkFBSlRTUUFDTURFQUFsTkxBQnhQVjFOWloxWllZM1ZCVGxoWVJqTjZZUzlOZWs1YVFVWmpjVEE5QUFSMGVYQmxBQWxKVGw5TlJVMVBVbGtBQWxNeEFBQS4qIn0.Q7uibzx2BIraKoItDJnI1YqulYSmgmnP7RQ3utrIFM8",
    "template": "",
    "stage": "DataStore1",
    "header": "Sign in",
    "callbacks": [
        {
            "type": "NameCallback",
            "output": [
                {
                    "name": "prompt",
                    "value": "User Name:"
                }
            ],
            "input": [
                {
                    "name": "IDToken1",
                    "value": "kne161"
                }
            ]
        },
        {
            "type": "PasswordCallback",
            "output": [
                {
                    "name": "prompt",
                    "value": "Password:"
                }
            ],
            "input": [
                {
                    "name": "IDToken2",
                    "value": "Shaman234wer"
                }
            ]
        }
    ]
}
*/