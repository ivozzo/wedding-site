//Loading Modules
const mongodb_tools = require('./mongodb'),
    objects = require('./objects');

module.exports = {
    insertUser: function (req, res) {
        insert_User(req, res);
    },

    updateUser: function (req, res) {
        update_User(req, res);
    }
}

/**
 * Insert user on database
 * @function insert_User
 * @param  {Request} req
 * @param  {Response} res
 */
function insert_User(req, res) {

    var user = objects.User(
        req.body.Name,
        req.body.Surname,
        req.body.Email,
        req.body.Username,
        req.body.Password);

    console.log(`Got an user creation request`);

    //add the user to the collection
    mongodb_tools.createUser(user, function (err, response) {
        if (err) {
            console.error(err);

            notification.show = true;
            notification.error = true;
            notification.message = `Impossibile creare l'utente.`;

        } else {
            console.log("User has been correctly inserted");

            notification.show = true;
            notification.error = false;
            notification.message = `Utente creato con successo.`;
        }
    });
    req.session.notification = notification;
    res.render('user.pug', {
        notification: notification
    });
}

/**
 * Update user on database
 * @function update_User
 * @param  {Request} req
 * @param  {Response} res
 */
function update_User(req, res) {

    var new_password = req.body.newPassword;
    if (new_password === req.body.confirmNewPassword) {
        var user = objects.User(
            "",
            "",
            "",
            req.body.Username,
            req.body.oldPassword
        )

        var old_password = user.password;

        mongodb_tools.findUserByUsername(user, function (err, response) {
            if (err) {
                console.error(err);

                notification.show = true;
                notification.error = true;
                notification.message = `Impossibile recuperare l'utente, controllare il log.`

                req.session.notification = notification;
                res.render('user.pug', {
                    notification: notification
                });
            }

            if (response.users[0].login.user === req.body.Username) {
                if (response.users[0].login.password === old_password) {

                    var updatedUser = response.users[0];
                    updatedUser.login.password = objects.cryptPassword(new_password);

                    mongodb_tools.updateUser(updatedUser, function (err, response) {
                        if (err) {
                            console.error(err);

                            notification.show = true;
                            notification.error = true;
                            notification.message = `Impossibile aggiornare l'utente ${req.body.Username}`;

                            req.session.notification = notification;
                            res.render('user.pug', {
                                notification: notification
                            });
                        } else {
                            console.log(`User ${req.body.Username} updated`);

                            notification.show = true;
                            notification.error = false;
                            notification.message = `L'utente ${req.body.Username} è stato correttamente aggiornato`;

                            req.session.notification = notification;
                            res.render('user.pug', {
                                notification: notification
                            });
                        }
                    });
                } else {
                    console.log(`User %s found but password not correct`, user.username);

                    notification.show = true;
                    notification.error = false;
                    notification.message = `La password attuale non corrisponde`;

                    req.session.notification = notification;
                    res.render('user.pug', {
                        notification: notification
                    });
                }
            }
        });
    } else {
        console.log(`New password mismatch`);

        notification.show = true;
        notification.error = true;
        notification.message = `La nuova password non corrisponde alla conferma, si prega di riprovare`

        req.session.notification = notification;
        res.render('user.pug', {
            notification: notification
        });
    }
}