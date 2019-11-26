"use strict"
const request = require('request');
const Base64 = require('js-base64').Base64
const DomParser = require('dom-parser');
const parser = new DomParser();
const jarcookie = request.jar();
const express = require('express');
const router = express.Router();
router.post('/', (req, res) => {

    function make_base_auth() {
        var tok = XXX+ ':' + 'XXXXXXX';
        var hash = Base64.encode(tok);
        return "Basic " + hash;
    }
    request({
        jar: jarcookie,
        url: 'https://confluence.associatesys.local/display/RETEQA/Grid2019.17+Release+Assignments',
        headers: { authorization: make_base_auth() },
        method: 'GET',
        rejectUnauthorized: false,
    },
        (err, resp, body) => {
            console.log(resp.statusCode)
            let htmlPage = parser.parseFromString(body, 'utf8')
            let ticketTable = htmlPage.getElementsByClassName('table-wrap')[0]
            let tbody = ticketTable.getElementsByTagName('tbody')[0]
            let trs = tbody.getElementsByTagName('tr');
            let tds = trs[1].getElementsByClassName('confluenceTd');
            let exportTickets = [];
            for (let i = 0; i < trs.length; i++) {
                exportTickets[i] = [];
                for (let x = 0; x < tds.length; x++) {
                    if (trs[i].getElementsByClassName('confluenceTh')[x] != undefined) {
                        exportTickets[i].push(trs[i].getElementsByClassName('confluenceTh')[x].textContent);
                    } else if (trs[i].getElementsByClassName('confluenceTd')[x] != undefined) {
                        exportTickets[i].push(trs[i].getElementsByClassName('confluenceTd')[x].textContent);

                    }

                }

            }
            res.send(exportTickets)

        });

});

router.get('/', (req, res) => {

    function make_base_auth() {
        var tok = 'kne161' + ':' + 'Shaman234wer';
        var hash = Base64.encode(tok);
        return "Basic " + hash;
    }

    console.log(make_base_auth())
    request({
        jar: jarcookie,
        url: 'https://confluence.associatesys.local/display/RETEQA/Grid2019.17+Release+Assignments',
        headers: { authorization: make_base_auth() },
        method: 'GET',
        rejectUnauthorized: false,
    },
        (err, resp, body) => {
            console.log(resp.statusCode)
            let htmlPage = parser.parseFromString(body, 'utf8')
            let ticketTable = htmlPage.getElementsByClassName('table-wrap')[0]
            let tbody = ticketTable.getElementsByTagName('tbody')[0]
            let trs = tbody.getElementsByTagName('tr');
            let tds = trs[1].getElementsByClassName('confluenceTd');
            let exportTickets = [];
            for (let i = 0; i < trs.length; i++) {
                exportTickets[i] = [];
                for (let x = 0; x < tds.length; x++) {
                    if (trs[i].getElementsByClassName('confluenceTh')[x] != undefined) {
                        exportTickets[i].push(trs[i].getElementsByClassName('confluenceTh')[x].textContent);
                    } else if (trs[i].getElementsByClassName('confluenceTd')[x] != undefined) {
                        exportTickets[i].push(trs[i].getElementsByClassName('confluenceTd')[x].textContent);

                    }

                }

            }
            res.send(exportTickets)

        });

});
module.exports = router;