// Loading Modules
const express = require('express'),
    router = express.Router(),
    mongodbtools = require('../utilities/mongodb-tools'),
    objects = require('../utilities/objects');

var sess;

// This is the console main index, also the splash page
router.get('/', function (req, res) {
    console.log(`Got a request on /console`);
    sess = req.session;
    console.log(`Session: %s`, JSON.stringify(sess));
    if (sess.username) {
        console.log(`User: %s`, sess.username);
        res.render('console.pug', {
            notification: notification,
            titles: titles
        });
    } else {
        mongodbtools.checkInitialized(function (err, response) {
            if (err) {
                console.log(`Impossibile effettuare il controllo sulla collection`);
            }
        });
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
    console.log(`Checking if there's an user with the username: %s`, req.body.Username);
    var user = objects.User(
        "",
        "",
        "",
        req.body.Username,
        req.body.Password);

    mongodbtools.findUser(user, function (err, response) {
        if (err) {
            console.log(`No user found, redirecting to login`);
            res.render('/login');
        }

        if (response.users[0].login.user === user.username) {
            if (response.users[0].login.password === user.password) {
                console.log(`User %s found and correctly authenticated`, user.username);
                req.session.username = user.username;
                res.redirect('/console');
            } else {
                console.log(`User %s found but password not correct`, user.username);
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

    var guest = objects.Guest(
        req.body.Name,
        req.body.Surname,
        req.body.Email,
        req.body.Expected);

    console.log(`Got the following guest invitation: %s`, JSON.stringify(guest));

    //add the guest to the COLL_GUEST collection
    mongodbtools.createGuest(guest, function (err, response) {
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

    var user = objects.User(
        req.body.Name,
        req.body.Surname,
        req.body.Email,
        req.body.Username,
        req.body.Password);

    console.log(`Got an user creation request`);

    //add the user to the COLL_USER collection
    mongodbtools.createUser(user, function (err, response) {
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

router.post('/update_user', function (req, res){
    var error_user;

    var new_password = req.body.newPassword;

    var user = objects.User(
        "",
        "",
        "",
        req.session.username,
        req.body.oldPassword
    )

        mongodbtools.findUser(user, function (err, response) {
        if (err) {
            //TODO add notification error
            console.log(`No user found, redirecting to login`);
        }

        if (response.users[0].login.user === user.username) {
            if (response.users[0].login.password === user.password) {

                var user = response.users[0];
                user.login.password = objects.cryptPassword(new_password);

                mongodbtools.updateUser(user, function (err, response){

                });
            } else {
                //TODO add notification error
                console.log(`User %s found but password not correct`, user.username);
                res.render('/console');
            }
        }
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