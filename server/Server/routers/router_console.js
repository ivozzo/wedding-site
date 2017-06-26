//Loading Modules
var express = require('express'),
    router = express.Router(),
    mongodbtools = require('../utilities/mongodb-tools');

//Constants
const COLL_GUEST = 'Guest-List',
    COLL_USER = 'Users';

function Guest(name_given, surname_given, mail_given, expected_number_given) {
    var guest = {
        name: name_given,
        surname: surname_given,
        mail: mail_given,
        generated_token: '',
        expected_number: expected_number_given
    };

    return guest;
}

//Router
router.get('/', function (req, res) {
    //splash page
    console.log(`Got a request on /console`)
    res.render('console.pug')
});

router.post('/init', function (req, res) {
    mongodbtools.initCollection(COLL_USER, function (err, response) {
        if (err && response.body == 'KO') {
            console.log('La collection %s esiste già', COLL_USER);
            var error_user = err;
        } else {
            console.log('La collection %s è stata correttamente creata', COLL_USER);
            var report_user = true;
        }
    });

    mongodbtools.initCollection(COLL_GUEST, function (err, response) {
        if (err && response.body == 'KO') {
            console.log('La collection %s esiste già', COLL_GUEST);
            var error_guest = err;
        } else {
            console.log('La collection %s è stata correttamente creata', COLL_GUEST);
            var report_guest = true;
        }
    })

    if (error_user === true && error_guest === true) {
        notification.show = true;
        notification.error = true;
        notification.message = `Il database è già stato inizializzato. 
Impossibile creare le collection.`;
    } else {
        notification.show = true;
        notification.error = false;
        notification.message = `Il database è stato correttamente inizializzato.`;
    }

    res.render('console.pug', notification);
})

router.post('/insert', function (req, res) {
    var guest = Guest(
        req.body.Name,
        req.body.Surname,
        req.body.Email, 
        req.body.Expected);

    console.log(JSON.stringify(guest));
    //mongodbtools.createGuest(COLL_GUEST, function(err, response){

    //

    //});
});

module.exports = router;