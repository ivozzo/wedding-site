/* Wedding site */

// Loading modules
var express = require('express');
var mongodbtools = require('./mongodb-tools');
var pug = require('pug');
var bodyParser = require('body-parser');

// Constants
const PORT = 8021;
const WORKING_PATH = '/index';
const COLL_GUEST = 'Guest-List';
const COLL_USER = 'Users'

// Variables
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'pug')

// Express module
app.get('/', function (req, res) {
    //redirect the root to the working path
    console.log(`Redirecting to ${WORKING_PATH}`)
    res.redirect(WORKING_PATH);
});

app.get(WORKING_PATH, function (req, res) {
    //splash page
    console.log(`Got a request on ${WORKING_PATH}`)
    res.render('index.pug')
});

app.post('/init', function (req, res) {
    mongodbtools.initCollection(COLL_USER, function(err, response){
        if (err && response.body == 'KO') {
            console.log(err);
        } else {
            console.log(response.body);
            //TODO
        }
    });

    mongodbtools.initCollection(COLL_GUEST, function(err, response){
        if (err && response.body == 'KO') {
            console.log(err);
        } else {
            console.log(response.body);
            //TODO
        }
    })
})

/* 
Defining the wedding site 
*/
var weddingsite = app.listen(PORT, function() {
    var host = weddingsite.address().address;
    var port = weddingsite.address().port;

    console.log('Wedding site listening on host %s, port %s', host, port);
});
