// Loading Modules
const express = require('express'),
    router = express.Router(),
    mongodbtools = require('../utilities/mongodb-tools'),
    crypto = require('crypto'),
    base64url = require('base64url');


var sess;

// Create a random token
function randomStringAsBase64Url(size) {
    return base64url(crypto.randomBytes(size));
}

// Guest object creator
function Guest(name_given, surname_given, email_given, expected_number_given) {
    var guest = {
        name: name_given,
        surname: surname_given,
        email: email_given,
        generated_token: randomStringAsBase64Url(64),
        expected_number: expected_number_given
    };

    return guest;
}

// User object creator
function User(name_given, surname_given, email_given, username_given, password_given) {
    var user = {
        name: name_given,
        surname: surname_given,
        email: email_given,
        username: username_given,
        password: password_given
    };

    return user;
}

// This is the console main index, also the splash page
router.get('/', function (req, res) {
    console.log(`Got a request on /console`);
    sess = req.session;
    console.log(`Session: %s`, sess);
    if (sess) {
        console.log(`User: %s`, sess.username);
        res.render('console.pug', {
            notification: notification,
            titles: titles
        });
    } else {
        res.redirect('/console/login');
    }

});

// Login page, this is where the unauthorized request con /console will be redirected
router.get('/login', function (req, res) {
    console.log(`Got a request on /console/login`);
    res.render('login.pug', {
        notification: notification,
        titles: titles
    });
});

router.post('/login', function (req, res) {
    console.log(`Checking if there's an user with the usernam: %s`, req.body.username);
    var user = User("", "", "", req.body.username, req.body.password);
    mongodbtools.findUser(myCollection.user, user, function (err, response) {
        if (err) {
            console.log(`Impossibile trovare l'utente richiesto`);
        }
        if (response.user.username === user.username) {
            if (response.user.password === user.password) {
                console.log(`User %s found and correctly authenticated`);
                req.session.username = user.username;
                res.redirect('/');
            } else {
                console.log(`User %s found but password not correct`);
                res.render('/login');
            }
        }
    });
});

// Database initialization
router.post('/init', function (req, res) {
    var error_user = false;
    var error_guest = false;

    //initializing COLL_USER collection, if the collection already exists return an error
    mongodbtools.initCollection(myCollection.user, function (err, response) {
        if (err && response.body == 'KO') {
            console.log('La collection %s esiste già', COLL_USER);
            error_user = true;
        } else {
            console.log('La collection %s è stata correttamente creata', COLL_USER);
            var report_user = true;
        }
    });

    //initializing COLL_GUEST collection, if the collection already exists return an error
    mongodbtools.initCollection(myCollection.guest, function (err, response) {
        if (err && response.body == 'KO') {
            console.log('La collection %s esiste già', COLL_GUEST);
            error_guest = true;
        } else {
            console.log('La collection %s è stata correttamente creata', COLL_GUEST);
            var report_guest = true;
        }
    })

    //If an error has been thrown prepare the error notification, else prepare the success notification
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

    res.render('console.pug', {
        notification: notification,
        titles: titles
    });
});

// Guest addition
router.post('/insert_guest', function (req, res) {
    var error_guest;

    var guest = Guest(
        req.body.Name,
        req.body.Surname,
        req.body.Email,
        req.body.Expected);

    console.log(`Got the following guest invitation: %s`, JSON.stringify(guest));

    //add the guest to the COLL_GUEST collection
    mongodbtools.createGuest(myCollection.guest, guest, function (err, response) {
        if (err) {
            console.log("Impossibile creare l'invitato.")
            error_guest = err;
        } else {
            console.log("L'invitato è stato correttamente inserito");
        }
    });

    //if an error has happened prepare the error notification
    if (error_guest === true) {
        notification.show = true;
        notification.error = true;
        notification.message = `Impossibile creare l'invitato.`;
    }

    res.render('console.pug', {
        notification: notification,
        titles: titles
    });
});

// User addition
router.post('/insert_user', function (req, res) {
    var error_user;

    var user = User(
        req.body.Name,
        req.body.Surname,
        req.body.Email,
        req.body.Username,
        req.body.Password);

    console.log(`Got an user creation request`);

    //add the user to the COLL_USER collection
    mongodbtools.createGuest(myCollection.user, user, function (err, response) {
        if (err) {
            console.log("Impossibile creare l'utente.")
            error_guest = err;
        } else {
            console.log("L'utente è stato correttamente inserito");
        }
    });

    //if an error has happened prepare the error notification
    if (error_user === true) {
        notification.show = true;
        notification.error = true;
        notification.message = `Impossibile creare l'utente.`;
    }

    res.render('console.pug', {
        notification: notification,
        titles: titles
    });
});

// List all the guests
router.get('/list_guest', function (req, res) {
    console.log('Got a request on /list');

    //search in the COLL_GUEST collection for all guests and return a list
    mongodbtools.listGuest(myCollection.guest, function (err, response) {
        if (err) {
            console.log('Impossibile recuperare la lista degli invitati');

            notification.show = true;
            notification.error = true;
            notification.message = 'Impossibile recuperare la lista degli invitati';

            res.render('console.pug', notification);
        } else {
            if (response.error === true && response.body === 'query') {
                notification.show = true;
                notification.error = false;
                notification.message = 'La lista degli invitati risulta vuota';
                res.render('console.pug', notification);
            } else if (response.error === false && response.body === 'guests') {
                console.log(response);
                console.log('Recuperata la lista degli ospiti');
                res.render('list.pug', {
                    headers: response.headers,
                    guests: response.guests
                });
            }
        }
    })
});

module.exports = router;