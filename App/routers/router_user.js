// Loading Modules
const express = require('express'),
    router = express.Router(),
    user_tools = require('../utilities/user'),
    login_tools = require('../utilities/login');

// Splash page
router.get('/', function (req, res) {
    console.log(`GET: /guest`);
    login_tools.checkLogin(req.session, res, 'user.pug');
});

// User addition
router.post('/insert', function (req, res) {
    console.log(`POST: /user/insert`);
    user_tools.insertUser(req, res);
});

// User update
router.post('/update', function (req, res) {
    console.log(`POST: /user/update`);
    user_tools.updateUser(req,res);
});

module.exports = router;