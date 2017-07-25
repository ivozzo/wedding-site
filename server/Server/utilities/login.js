const mongodb_tools = require('./mongodb'),
    objects = require('./objects');

module.exports = {
    checkLogin: function (sess, res, page) {
        check_session(sess, res, page);
    },

    userLogin: function (req, res) {
        user_login(req, res);
    }
}

/**
 * Check if there's a session saved, otherwise redirect the user to login page
 * @function check_session
 * @param  {Session} sess {The saved session}
 * @param  {Response} res
 * @param  {PUG} page {The page to redirect for}
 */
function check_session(sess, res, page) {
    if (sess.username) {
        console.log(`User session found: %s`, sess.username);

        res.render(page, {
            notification: notification,
        });
    } else {
        mongodb_tools.checkInitialized(function (err, response) {
            if (err) {
                console.log(`Cannot check if the database has already been initialized`);
            }
        });
        res.redirect('/login');
    }
}

/**
 * User login
 * @function user_login
 * @param  {Request} req
 * @param  {Response} res
 */
function user_login(req, res) {
    var user = objects.User(
        "",
        "",
        "",
        req.body.Username,
        req.body.Password);

    mongodb_tools.findUser(user, function (err, response) {
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
}