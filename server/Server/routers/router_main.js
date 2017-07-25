// Loading Modules
const express = require('express'),
    router = express.Router();

// Redirecting all get requests on WORKING_PATH
router.get('/', function (req, res) {
    console.log(`GET: / - redirecting to /index`)
    res.redirect('/index');
});

// This is the main page, also the splash page
router.get('/index', function (req, res) {
    console.log(`GET: /index`);
    res.render('index.pug');
});

module.exports = router;