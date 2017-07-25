// Loading Modules
const express = require('express'),
    router = express.Router(),
    mongodbtools = require('../utilities/mongodb'),
    logintools = require('../utilities/login'),
    objects = require('../utilities/objects');

router.get('/', function (req, res) {
    console.log(`GET: /guest`);

    logintools.checkLogin(req.session, res, 'guest.pug');
});

// Guest addition
router.post('/insert', function (req, res) {
    console.log('POST: /guest/insert');

    var error_guest;

    console.log(req.body);

    var guest = objects.Guest(
        req.body.Name,
        req.body.Surname,
        req.body.Email,
        req.body.Expected);

    //add the guest to the collection
    mongodbtools.createGuest(guest, function (err, response) {
        if (err) {
            console.log("Cannote create Guest object on database")
            error_guest = err;
        } else {
            console.log("Guest has been correctly inserted");
        }
    });

    //if an error has happened prepare the error notification
    if (error_guest === true) {
        notification.show = true;
        notification.error = true;
        notification.message = `Impossibile creare l'invitato.`;
    } else {
        notification.show = true;
        notification.error = false;
        notification.message = `Invitato creato con successo`;
    }

    res.render('console.pug', {
        notification: notification
    });
});

// List all the guests
router.get('/list', function (req, res) {
    console.log('GET: /guest/list');

    //search in the collection for all guests and return a list
    mongodbtools.listGuest(function (err, response) {
        if (err) {
            console.log('Impossibile recuperare la lista degli invitati');

            notification.show = true;
            notification.error = true;
            notification.message = 'Impossibile recuperare la lista degli invitati';

            res.render('console.pug', {
                notification: notification
            });
        } else {
            if (response.error === true && response.body === 'query') {
                notification.show = true;
                notification.error = false;
                notification.message = 'La lista degli invitati risulta vuota';

                res.render('console.pug', {
                    notification: notification
                });
            } else if (response.error === false && response.body === 'guests') {
                console.log('Recuperata la lista degli ospiti');

                res.render('list.pug', {
                    headers: response.headers,
                    notification: notification,
                    guests: response.guests
                });
            }
        }
    })
});

// Guests RSVP page
router.get('/rsvp', function (req, res) {
    console.log(`Got a request on ${RSVP_PATH}`);
    res.render('rsvp.pug');
});

module.exports = router;