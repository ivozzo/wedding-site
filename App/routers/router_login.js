// Loading Modules
const express = require('express'),
    router = express.Router(),
    login_tools = require('../utilities/login');

var sess;

// Login page, this is where the unauthorized request on /console will be redirected
router.get('/', function (req, res) {
    console.log(`GET: /login`);

    res.render('login.pug', {
        notification: notification
    });
});

// Login request
router.post('/', function (req, res) {
    console.log(`POST: /login`);
    login_tools.userLogin(req, res);
});

// Logout request
router.post('/exit', function(req, res) {
    console.log(`POST: /login/exit`);
    login_tools.userLogout(req,res);
});

module.exports = router;