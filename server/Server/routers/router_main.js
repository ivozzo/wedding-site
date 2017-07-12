// Loading Modules
var express = require('express'),
    router = express.Router();

// Constants
const WORKING_PATH = '/index';

// Redirecting all get requests on WORKING_PATH
router.get('/', function (req, res) {
    console.log(`Redirecting to ${WORKING_PATH}`)
    res.redirect(WORKING_PATH);
});

// This is the main page, also the splash page
router.get(WORKING_PATH, function (req, res) {
    console.log(`Got a request on ${WORKING_PATH}`)
    res.render('index.pug')
});

module.exports = router;