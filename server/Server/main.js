/* Wedding site */

// Loading modules
var express = require('express');
var mongodbtools = require('./mongodbtools');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');

// Constants
const PORT = 8021;
const WORKING_PATH = '/index';

// Variables
var app = express();

// Settings
app.use(bodyParser.urlencoded({
    extended: true
}));
nunjucks.configure('.', {
    autoescape: true,
    express: app
});

// Express module

app.get('/', function (req, res) {
    //redirect the root to the working path
    console.log(`Redirecting to ${WORKING_PATH}`)
    res.redirect(WORKING_PATH);
});

app.get(WORKING_PATH, function (req, res) {
    //splash page
    console.log(`Got a request on ${WORKING_PATH}`)
});

app.post('/init', function (req, res) {
    mongodbtools.initdb(function(err, response){
        if (err && response.body == 'KO') {
            console.log(err);
        } else {
            //TODO
        }
    });
})