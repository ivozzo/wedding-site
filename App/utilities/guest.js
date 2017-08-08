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
    },

    rsvpGuest: function (req, res) {
        rsvp_Guest(req, res);
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

    var skip;
    if (req.body.skipMail == "on") {
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
            console.error(err);

            notification.show = true;
            notification.error = true;
            notification.message = `Impossibile creare l'invitato.`;

            req.session.notification = notification;
        } else {
            console.log("Guest has been correctly inserted");

            notification.show = true;
            notification.error = false;
            notification.message = `Invitato creato con successo`;

            req.session.notification = notification;
        }
        res.render('guest.pug', {
            notification: notification
        });
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
            console.error(err);

            notification.show = true;
            notification.error = true;
            notification.message = 'Impossibile recuperare la lista degli invitati';

            req.session.notification = notification;
            res.render('console.pug', {
                notification: notification
            });
        } else {
            if (response.guests.length === 0) {
                console.warn(`Found an empty guest list, please add some guests first`);

                notification.show = true;
                notification.error = false;
                notification.message = 'La lista degli invitati risulta vuota';

                req.session.notification = notification;
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

    if (!req.body.Name || !req.body.Surname) {
        console.log(`Missing required field (name and surname)`);

        notification.show = true;
        notification.error = true;
        notification.message = `Nome e cognome dell'invitato sono obbligatori per aggiornare i dati dell'invitato`;

        req.session.notification = notification;
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

                req.session.notification = notification;
                res.render('guest.pug', {
                    notification: notification
                });
            }

            updatedGuest = response.guests[0];
            updatedGuest.email = guest.email;
            updatedGuest.expected_number = guest.expected_number;
            updatedGuest.attendance = guest.attendance;
            updatedGuest.skip_email = guest.skip_email;

            mongodb_tools.updateGuest(updatedGuest, function (err, response) {
                if (err) {
                    console.error(err);

                    notification.show = true;
                    notification.error = true;
                    notification.message = `Impossibile aggiornare l'invitato ${req.body.Name} ${req.body.Surname}`;

                    req.session.notification = notification;
                    res.render('guest.pug', {
                        notification: notification
                    });
                } else {
                    console.log(`Guest ${req.body,Name} ${req.body.Surname} updated`);

                    notification.show = true;
                    notification.error = false;
                    notification.message = `L'invitato ${req.body.Name} ${req.body.Surname} è stato correttamente aggiornato`;

                    req.session.notification = notification;
                    res.render('guest.pug', {
                        notification: notification
                    });
                }
            });
        });
    }
}

/**
 * Update guest on database via RSVP
 * @function rsvp_Guest
 * @param  {Request} req
 * @param  {Response} res
 */
function rsvp_Guest(req, res) {

    if (!req.body.Email || !req.body.Token || !req.body.Expected_number) {
        console.log(`Missing required fields (email, token or expected number`);

        notification.show = true;
        notification.error = true;
        notification.message = `Email, token dell'invitato e numero dei partecipanti sono obbligatori per aggiornare i dati`;

        req.session.notification = notification;
        res.render('rsvp.pug', {
            notification: notification
        });

    } else {

        var guest = objects.Guest(
            '',
            '',
            req.body.Email,
            req.body.Expected_number,
            '',
            req.body.Presence);

        guest.generated_token = req.body.Token;
        mongodb_tools.findGuestByEmail(guest, function (err, response) {
            if (err) {
                console.error(err);

                notification.show = true;
                notification.error = true;
                notification.message = `Impossibile recuperare i dati dell'invitato, per favore controllare che email e token siano corretti`;

                req.session.notification = notification;
                res.render('rsvp.pug', {
                    notification: notification
                });
            }

            if (response.guests.length === 0) {
                console.log(`No guest found`);

                notification.show = true;
                notification.error = true;
                notification.message = `Impossibile recuperare i dati dell'invitato, per favore controllare che email e token siano corretti`;

                req.session.notification = notification;
                res.render('rsvp.pug', {
                    notification: notification
                });
            } else {
                if (response.guests[0].generated_token === req.body.Token) {
                    updatedGuest = response.guests[0];
                    updatedGuest.expected_number = guest.expected_number;
                    updatedGuest.attendance = guest.attendance;

                    mongodb_tools.updateGuestRSVP(updatedGuest, function (err, response) {
                        if (err) {
                            console.error(err);

                            notification.show = true;
                            notification.error = true;
                            notification.message = `Impossibile aggiornare i dati, contattare l'amministratore`;

                            req.session.notification = notification;
                            res.render('rsvp.pug', {
                                notification: notification
                            });

                        } else {
                            console.log(`Guest updated by RSVP page`);

                            notification.show = true;
                            notification.error = false;
                            notification.message = `L'invitato ${req.body.Name} ${req.body.Surname} è stato correttamente aggiornato`;

                            req.session.notification = notification;
                            res.render('rsvp.pug', {
                                notification: notification
                            });
                        }
                    });
                } else {
                    console.log(`Cannot authenticate guest on RSVP page`);

                    notification.show = true;
                    notification.error = true;
                    notification.message = `Non è stato possibile autenticare la richiesta, si prega di controllare il token`;

                    req.session.notification = notification;
                    res.render('rsvp.pug', {
                        notification: notification
                    });
                }
            }

        });
    }
}