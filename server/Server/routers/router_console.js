//Loading Modules
var express = require('express'),
    router = express.Router(),
    mongodbtools = require('../utilities/mongodb-tools');

//Constants
const COLL_GUEST = 'Guest-List',
      COLL_USER = 'Users';

//Router
router.get('/', function (req, res) {
    //splash page
    console.log(`Got a request on /console`)
    res.render('database.pug')
});

router.post('/init', function (req, res) {
    mongodbtools.initCollection(COLL_USER, function(err, response){
        if (err && response.body == 'KO') {
            console.log('La collection %s esiste già', COLL_USER);
        } else {
            console.log('La collection %s è stata correttamente creata', COLL_USER);
            //TODO
        }
    });

    mongodbtools.initCollection(COLL_GUEST, function(err, response){
        if (err && response.body == 'KO') {
            console.log('La collection %s esiste già', COLL_GUEST);
        } else {
            console.log('La collection %s è stata correttamente creata', COLL_GUEST);            
            //TODO
        }
    })
})

module.exports = router;