// Loading Modules
const express = require('express'),
    router = express.Router(),
    mongodbtools = require('../utilities/mongodb'),
    login_tools = require('../utilities/login'),
    guest_tools = require('../utilities/guest'),
    objects = require('../utilities/objects');

// Splash
router.get('/', function (req, res) {
    console.log(`GET: /guest`);
    login_tools.checkLogin(req.session, res, 'guest.pug');
});

// Guest addition
router.post('/insert', function (req, res) {
    console.log('POST: /guest/insert');
    guest_tools.insertGuest(req,res);
});

// List all the guests
router.get('/list', function (req, res) {
       console.log('GET: /guest/list');
       guest_tools.listGuest(req,res);
});

// Guests RSVP page
router.get('/rsvp', function (req, res) {
    console.log(`Got a request on ${RSVP_PATH}`);
    res.render('rsvp.pug');
});

module.exports = router;