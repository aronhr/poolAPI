"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const fs = require('fs');

let pools;
fs.readFile('pools.json', 'utf8', function (err, data) {
    if (err) throw err;
    pools = JSON.parse(data);
});

app.use(bodyParser.json());

/** ================== STATIONS ================== */
/**
 * Returns an array of all stations. For each station, only the description and the id is included in the
 * response
 */
app.get('/pools', (req, res) => {
    let stations_exp = [];
    for (let i = 0; i < pools.results.length; i++){
        stations_exp.push({"id" : pools.results[i].id,"name": pools.results[i].name, "description": pools.results[i].description, "thumb" : pools.results[i].thumb, "location": pools.results[i].location,  "geo": pools.results[i].geo});
    }
    res.status(200).json({results: stations_exp});
});

/**
 * Returns all attributes of a specified station
 */
app.get('/pools/:id', (req, res) => {
    for (let i = 0; i < pools.results.length; i++){
        if (pools.results[i].id === req.params.id){
            res.status(200).json({results: [pools.results[i]] });
            return;
        }
    }
    res.status(404).json({'error': "Pool with id " + req.params.id + " does not exist."});
});

/**
 * Handles incorrect url requests!
 */

app.get('/img/:name', function (req, res, next) {
    let options = {
        root: __dirname + '/img/',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    let fileName = req.params.name;
    res.sendFile(fileName, options, function (err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent:', fileName);
        }
    });

});

app.use('*', (req, res) => {
    res.status(405).json({'error': 'This operation is not supported.'});
});

app.listen(port, () => console.log(`App listening on localhost:${port}`));