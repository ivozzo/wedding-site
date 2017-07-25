// Loading Modules
const express = require('express'),
    router = express.Router(),
    database_tools = require(`../utilities/database`),
    login_tools = require('../utilities/login');

// This is the console main index, also the splash page
router.get('/', function (req, res) {
    console.log(`GET: /console`);
    login_tools.checkLogin(req.session, res, 'console.pug');
});

// Database initialization
router.post('/init', function (req, res) {
    console.log(`POST: /console/init`);
    database_tools.initializeDatabase;
});

module.exports = router;