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
    var error_user;

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

    mongodb_tools.findUser(user, function (err, response) {
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

                mongodb_tools.updateUser(updatedUser, function (err, response) {

                });
            } else {
                //TODO add notification error
                console.log(`User %s found but password not correct`, user.username);
                res.render('user.pug', {
                    notification: notification
                });
            }
        }
    });
}