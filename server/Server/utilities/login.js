const mongodbtools = require('./mongodb');

module.exports = {
    checkLogin: function (sess, res, page) {
        check_session(sess, res, page);
    }
}

function check_session(sess, res, page) {
    if (sess.username) {
        console.log(`User session found: %s`, sess.username);

        res.render(page, {
            notification: notification,
        });
    } else {
        mongodbtools.checkInitialized(function (err, response) {
            if (err) {
                console.log(`Cannot check if the database has already been initialized`);
            }
        });
        res.redirect('/login');
    }
}