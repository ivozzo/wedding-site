// Loading Modules
const express = require('express'),
    router = express.Router(),
    mongodbtools = require('../utilities/mongodb'),
    objects = require('../utilities/objects');

var sess;

// Login page, this is where the unauthorized request on /console will be redirected
router.get('/', function (req, res) {
    console.log(`GET: /login, showing notification: %s`, JSON.stringify(notification));

    res.render('login.pug', {
        notification: notification,
        titles: titles
    });
});

// Login request
router.post('/', function (req, res) {
    console.log(`POST: /login, checking if there's an user with the username: %s`, req.body.Username);
    var user = objects.User(
        "",
        "",
        "",
        req.body.Username,
        req.body.Password);

    mongodbtools.findUser(user, function (err, response) {
        if (err) {
            console.log(`No user found, redirecting to /login`);

            notification.show = true;
            notification.error = true;
            notification.message = `Impossibile trovare l'utente richiesto`;

            res.redirect('/login');
        }

        if (response.users[0].login.user === user.username) {
            if (response.users[0].login.password === user.password) {
                console.log(`User %s found and correctly authenticated`, user.username);
                req.session.username = user.username;

                console.log(`Redirecting to /console`);
                res.redirect('/console');
            } else {
                console.log(`User %s found but password not correct, redirecting to /login`, user.username);

                notification.show = true;
                notification.error = true;
                notification.message = `La password non è corretta, si prega di verificare`;

                res.redirect('/login');
            }
        }
    });
});

module.exports = router;