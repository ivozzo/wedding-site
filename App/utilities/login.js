const mongodb_tools = require('./mongodb'),
    objects = require('./objects');

module.exports = {
    checkLogin: function (sess, res, page) {
        check_session(sess, res, page);
    },

    userLogin: function (req, res) {
        user_login(req, res);
    },

    userLogout: function (req, res) {
        user_logout(req, res);
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
                console.error(err);
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

    mongodb_tools.findUserByUsername({
        username: req.body.Username
    }, function (err, user) {
        if (err) {
            notification.show = true;
            notification.error = true;
            notification.message = `Errore durante l'autenticazione, controllare i log`;
            req.session.notification = notification;
            session.logged = false;
            session.username = "";
            res.redirect('/login');
        }
        if (user !== null) {
            if (user.login.user === req.body.Username) {
                if (user.login.password === objects.cryptPassword(req.body.Password)) {
                    console.log(`User found and correctly authenticated`);
                    req.session.username = req.body.Username;
                    session.logged = true;
                    session.username = user.name;
                    req.session.notification = notification;
                    res.redirect('/console');
                } else {
                    console.warn(`User found but password not correct`);
                    notification.show = true;
                    notification.error = true;
                    notification.message = `La password non è corretta, si prega di verificare`;
                    session.logged = false;
                    session.username = "";
                    req.session.notification = notification;
                    res.redirect('/login');
                }
            }
        } else {
            console.warn(`No user found`);
            notification.show = true;
            notification.error = true;
            notification.message = `Impossibile trovare l'utente richiesto`;
            session.logged = false;
            session.username = "";
            req.session.notification = notification;
            res.redirect('/login');
        }
    });
}

/**
 * User logout
 * @function user_logout
 * @param  {Request} req
 * @param  {Response} res
 */
function user_logout(req, res) {
    console.log(`User ${req.session.username} successfully logged out`);
    session.logged = false;
    session.username = "";
    res.redirect('/index');
}