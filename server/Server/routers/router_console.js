// Loading Modules
const express = require('express'),
    router = express.Router(),
    mongodbtools = require('../utilities/mongodb'),
    objects = require('../utilities/objects'),
    mailer = require('../utilities/mailer');

var sess;

// This is the console main index, also the splash page
router.get('/', function (req, res) {
    console.log(`Got a request on /console`);
    sess = req.session;
    if (sess.username) {
        console.log(`User: %s`, sess.username);
        res.render('console.pug', {
            notification: notification,
            titles: titles
        });
    } else {
        mongodbtools.checkInitialized(function (err, response) {
            if (err) {
                console.log(`Cannot check if the database has already been initialized`);
            }
        });
        res.redirect('/login');
    }

});

// Database initialization
router.post('/init', function (req, res) {
    var error_user = false;
    var error_guest = false;

    //initializing COLL_USER collection, if the collection already exists return an error
    mongodbtools.initCollection(myCollection.user, function (err, response) {
        if (err && response.body == 'KO') {
            console.log('Collection %s already existing', COLL_USER);
            error_user = true;
        } else {
            console.log('Collection %s has been correctly created', COLL_USER);
            var report_user = true;
        }
    });

    //initializing COLL_GUEST collection, if the collection already exists return an error
    mongodbtools.initCollection(myCollection.guest, function (err, response) {
        if (err && response.body == 'KO') {
            console.log('Collection %s already existing', COLL_GUEST);
            error_guest = true;
        } else {
            console.log('Collection %s has been correctly created', COLL_GUEST);
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
            console.log("Cannot create User object on database")
            error_user = err;
        } else {
            console.log("User has been correctly inserted");
        }
    });

    //if an error has happened prepare the error notification
    if (error_user === true) {
        notification.show = true;
        notification.error = true;
        notification.message = `Impossibile creare l'utente.`;
    } else {
        notification.show = true;
        notification.error = false;
        notification.message = `Utente creato con successo.`;
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
        req.body.Username,
        req.body.oldPassword
    )

    var old_password = user.password;

        mongodbtools.findUser(user, function (err, response) {
        if (err) {
            //TODO add notification error
            console.log(`No user found, redirecting to login`);
        }
        console.log(old_password)
        console.log(new_password)

        if (response.users[0].login.user === req.body.Username) {
            if (response.users[0].login.password === old_password) {

                var updatedUser = response.users[0];
                updatedUser.login.password = objects.cryptPassword(new_password);

                mongodbtools.updateUser(updatedUser, function (err, response){

                });
            } else {
                //TODO add notification error
                console.log(`User %s found but password not correct`, user.username);
                res.render('/console');
            }
        }
    });
});

module.exports = router;