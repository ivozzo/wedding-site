// Loading Modules
const express = require('express'),
    router = express.Router(),
    login_tools = require('../utilities/login'),
    guest_tools = require('../utilities/guest');

// Splash
router.get('/', function (req, res) {
    console.log(`GET: /guest`);
    login_tools.checkLogin(req.session, res, 'guest.pug');
});

// Guest addition
router.post('/insert', function (req, res) {
    console.log('POST: /guest/insert');
    guest_tools.insertGuest(req, res);
});

// Update the guest
router.post('/update', function (req, res) {
    console.log('POST: /guest/update');
    guest_tools.updateGuest(req, res);
});

// List all the guests
router.get('/list', function (req, res) {
    console.log('GET: /guest/list');
    guest_tools.listGuest(req, res);
});

// Guests RSVP page
router.get('/rsvp', function (req, res) {
    console.log(`GET: /guest/rsvp`);

    //If it's a new session clear notification
    if (req.session.notification === undefined){
        notification.show = false;
        notification.error = false;
        notification.message = '';
    }
    
    res.render('rsvp.pug', {
        notification: notification
    });
});

// Guest RSVP form
router.post('/rsvp', function (req, res) {
    console.log(`POST: /guest/rsvp`);
    guest_tools.rsvpGuest(req, res);
});

module.exports = router;