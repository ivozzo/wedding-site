//Loading Modules
var express = require('express'),
    router = express.Router();

//Constants
const WORKING_PATH = '/index';

//Router
router.get('/', function (req, res) {
    //redirect the root to the working path
    console.log(`Redirecting to ${WORKING_PATH}`)
    res.redirect(WORKING_PATH);
});

router.get(WORKING_PATH, function (req, res) {
    //splash page
    console.log(`Got a request on ${WORKING_PATH}`)
    res.render('index.pug')
});

module.exports = router;