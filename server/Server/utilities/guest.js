// Loading Modules
const mongodb_tools = require('./mongodb'),
    objects = require('./objects');

module.exports = {
    insertGuest: function (req, res) {
        insert_Guest(req, res);
    },

    listGuest: function (req, res) {
        list_Guests(req, res);
    },

    updateGuest: function (req, res) {
        update_Guest(req, res);
    }
}

/**
 * Create a guest on database
 * @function insert_Guest
 * @param  {Request} req
 * @param  {Response} res
 */
function insert_Guest(req, res) {
    var error_guest;

    console.log(req.body);

    var skip;
    if (req.body.skipMail !== undefined) {
        skip = true;
    } else {
        skip = false;
    }

    var guest = objects.Guest(
        req.body.Name,
        req.body.Surname,
        req.body.Email,
        req.body.Expected,
        skip,
        req.body.presence);

    //add the guest to the collection
    mongodb_tools.createGuest(guest, function (err, response) {
        if (err) {
            console.error("Cannote create Guest object on database")
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

    res.render('guest.pug', {
        notification: notification
    });
}

/**
 * List all guests on database
 * @function list_Guests
 * @param  {Request} req
 * @param  {Response} res
 */
function list_Guests(req, res) {

    //search in the collection for all guests and return a list
    mongodb_tools.listGuest(function (err, response) {
        if (err) {
            console.error('Impossibile recuperare la lista degli invitati');

            notification.show = true;
            notification.error = true;
            notification.message = 'Impossibile recuperare la lista degli invitati';

            res.render('console.pug', {
                notification: notification
            });
        } else {
            if (response.guests.length === 0) {
                console.warn(`Found an empty guest list, please add some guests first`);
                notification.show = true;
                notification.error = false;
                notification.message = 'La lista degli invitati risulta vuota';

                res.render('guest.pug', {
                    notification: notification
                });
            } else if (response.error === false && response.body === 'guests') {
                console.log(`Guest list retrieved`);

                res.render('list.pug', {
                    headers: response.headers,
                    notification: notification,
                    guests: response.guests
                });
            }
        }
    });
}

/**
 * Update guest on database
 * @function update_Guest
 * @param  {Request} req
 * @param  {Response} res
 */
function update_Guest(req, res) {
    var error_guest;

    if (!req.body.Name || !req.body.Surname) {
        notification.show = true;
        notification.error = true;
        notification.message = `Nome e cognome dell'invitato sono obbligatori per aggiornare i dati dell'invitato`;

        res.render('guest.pug', {
            notification: notification
        });

    } else {
        var skip;
        if (req.body.skipMailUpdate !== undefined) {
            skip = true;
        } else {
            skip = false;
        }

        var guest = objects.Guest(
            req.body.Name,
            req.body.Surname,
            req.body.EmailUpdate,
            req.body.ExpectedUpdate,
            skip,
            req.body.presenceUpdate);

        mongodb_tools.findGuest(guest, function (err, response) {
            if (err) {
                console.error(err);

                notification.show = true;
                notification.error = true;
                notification.message = `Impossibile recuperare l'invitato, controllare il log.`

                res.render('guest.pug', {
                    notification: notification
                });
            }

            updatedGuest = response.guests[0];
            updatedGuest.email = guest.email;
            updatedGuest.expected_number = guest.expected_number;
            updatedGuest.attendance = guest.attendance;
            updatedGuest.skip_email = guest.skip_email;

            console.log(updatedGuest);

            mongodb_tools.updateGuest(updatedGuest, function (err, response) {
                if (err) {
                    console.error(err);

                    notification.show = true;
                    notification.error = true;
                    notification.message = `Impossibile aggiornare l'invitato ${req.body.Name} ${req.body.Surname}`;

                    res.render('guest.pug', {
                        notification: notification
                    });
                } else {
                    console.log(`User ${req.body,Name} ${req.body.Surname} updated`);

                    notification.show = true;
                    notification.error = false;
                    notification.message = `L'invitato ${req.body.Name} ${req.body.Surname} è stato correttamente aggiornato`;

                    res.render('guest.pug', {
                        notification: notification
                    });
                }
            });
        });
    }
}