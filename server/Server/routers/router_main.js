// Loading Modules
const express = require('express'),
    router = express.Router();

// Constants
const WORKING_PATH = '/index',
    RSVP_PATH = '/rsvp';

// Redirecting all get requests on WORKING_PATH
router.get('/', function (req, res) {
    console.log(`Redirecting to ${WORKING_PATH}`)
    res.redirect(WORKING_PATH);
});

// This is the main page, also the splash page
router.get(WORKING_PATH, function (req, res) {
    console.log(`Got a request on ${WORKING_PATH}`);
    res.render('index.pug');
});

// Guests RSVP page
router.get(RSVP_PATH, function (req, res){
    console.log(`Got a request on ${RSVP_PATH}`);
    res.render('rsvp.pug');
});

module.exports = router;