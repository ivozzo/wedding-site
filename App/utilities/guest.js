// Loading Modules
const mongodb_tools = require('./mongodb'),
    objects = require('./objects');

module.exports = {
    insertGuest: function (req, res) {
        insert_Guest(req, res);
    },

    listGuest: function (req, res, page) {
        list_Guests(req, res, page);
    },

    updateGuest: function (req, res) {
        update_Guest(req, res);
    },

    deleteGuest: function (req, res) {
        delete_Guest(req, res);
    },

    rsvpGuest: function (req, res) {
        rsvp_Guest(req, res);
    },

    getGuestData: function (req, res) {
        get_GuestData(req, res);
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
    console.log(req.body)
    var skip;
    if (req.body.skipMail === "on") {
        skip = true;
    } else {
        skip = false;
    }
    var guest = objects.Guest(
        req.body.name,
        req.body.surname,
        req.body.email,
        req.body.expected,
        skip,
        req.body.presence);

    //add the guest to the collection
    mongodb_tools.createGuest(guest, function (err) {
        if (err) {
            notification.show = true;
            notification.error = true;
            notification.message = `Impossibile creare l'invitato.`;
        } else {
            console.log("Guest has been correctly inserted");
            notification.show = true;
            notification.error = false;
            notification.message = `Invitato creato con successo`;
        }
        req.session.notification = notification;
        res.redirect('back');
    });
}

/**
 * List all guests on database
 * @function list_Guests
 * @param  {Request} req
 * @param  {Response} res
 */
function list_Guests(req, res, page) {
    mongodb_tools.listGuest(function (err, response) {
        if (err) {
            notification.show = true;
            notification.error = true;
            notification.message = 'Impossibile recuperare la lista degli invitati';
            req.session.notification = notification;
            res.render(page, {
                headers: response.headers,
                notification: notification,
                guests: response.guests
            });
        } else {
            if (response.error === false && response.body === 'guests') {
                console.log(`Guest list retrieved`);
            }
            res.render(page, {
                headers: response.headers,
                notification: notification,
                guests: response.guests
            });
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
    if (!req.body.name || !req.body.surname) {
        console.log(`Missing required field (name and surname)`);
        notification.show = true;
        notification.error = true;
        notification.message = `Nome e cognome dell'invitato sono obbligatori per aggiornare i dati dell'invitato`;
        req.session.notification = notification;
        res.redirect('/guest');
    } else {
        var skip;
        if (req.body.skipMail === 'on') {
            skip = true;
        } else {
            skip = false;
        }
        mongodb_tools.findGuestByNameSurname({
            name: req.body.name,
            surname: req.body.surname
        }, function (err, guest) {
            if (err) {
                notification.show = true;
                notification.error = true;
                notification.message = `Impossibile recuperare l'invitato, controllare il log.`
                req.session.notification = notification;
                res.redirect('/guest');
            }
            guest.email = req.body.email;
            guest.expected_number = req.body.expected;
            guest.attendance = req.body.presence;
            guest.skip_email = skip;
            mongodb_tools.updateGuest(guest, function (err) {
                if (err) {
                    notification.show = true;
                    notification.error = true;
                    notification.message = `Impossibile aggiornare l'invitato ${req.body.name} ${req.body.surname}`;
                } else {
                    console.log(`Guest ${req.body.name} ${req.body.surname} updated`);
                    notification.show = true;
                    notification.error = false;
                    notification.message = `L'invitato ${req.body.name} ${req.body.surname} è stato correttamente aggiornato`;
                }
                req.session.notification = notification;
                res.redirect('/guest');
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
    if (!req.body.email || !req.body.token || !req.body.expected) {
        console.warn(`Missing required fields (email, token or expected number`);
        notification.show = true;
        notification.error = true;
        notification.message = `Email, token dell'invitato e numero dei partecipanti sono obbligatori per aggiornare i dati`;
        req.session.notification = notification;
        res.redirect('/guest/rsvp');
    } else {
        mongodb_tools.findGuestByEmail({
            email: req.body.email
        }, function (err, guest) {
            if (err) {
                notification.show = true;
                notification.error = true;
                notification.message = `Errore durante la connessione al database, contattare l'amministratore`;
                req.session.notification = notification;
                res.render('back');
            }
            if (guest !== null) {
                if (guest.generated_token === req.body.token) {
                    guest.expected_number = req.body.expected;
                    guest.attendance = req.body.presence;
                    mongodb_tools.updateGuest(guest, function (err) {
                        if (err) {
                            notification.show = true;
                            notification.error = true;
                            notification.message = `Impossibile recuperare i dati, contattare l'amministratore`;
                            req.session.notification = notification;
                            res.render('/guest/rsvp');
                        } else {
                            console.log(`Guest updated by RSVP page`);
                            notification.show = true;
                            notification.error = false;
                            notification.message = `Grazie per averci aggiornati`;
                            req.session.notification = notification;
                            res.render('/guest/rsvp');
                        }
                    });
                } else {
                    console.log(`Cannot authenticate guest on RSVP page`);
                    notification.show = true;
                    notification.error = true;
                    notification.message = `Non è stato possibile autenticare la richiesta, si prega di controllare il token`;
                    req.session.notification = notification;
                    res.render('/guest/rsvp');
                }
            } else {
                console.log(`No guest found`);
                notification.show = true;
                notification.error = true;
                notification.message = `Impossibile recuperare i dati, per favore controllare che l'email sia corretta`;
                req.session.notification = notification;
                res.render('/guest/rsvp');
            }
        });
    }
}

/**
 * Get guest data from database
 * @function get_GuestData
 * @param  {Request} req
 * @param  {Response} res
 */
function get_GuestData(req, res) {

    if (req.body.guest_id === 'nil') {
        console.log(`Missing required field (id)`);
        notification.show = true;
        notification.error = true;
        notification.message = `Non è stato selezionato nessun invitato`;
        req.session.notification = notification;
        res.redirect('/guest');
    } else {
        mongodb_tools.findGuestById(req.body.guest_id, function (err, guest) {
            if (err) {
                notification.show = true;
                notification.error = true;
                notification.message = `Impossibile recuperare l'invitato, controllare il log.`
                req.session.notification = notification;
                res.redirect('back');
            } else {
                console.log(`Guest found, now loading page with details`);
                res.render('guest-update.pug', {
                    notification: notification,
                    guest: guest
                });
            }
        });
    }
}

/**
 * Delete guest data from database
 * @function delete_Guest
 * @param  {Request} req
 * @param  {Response} res
 */
function delete_Guest(req, res) {
    if (req.body.guest_id === 'nil') {
        console.log(`Missing required field (id)`);
        notification.show = true;
        notification.error = true;
        notification.message = `Non è stato selezionato nessun invitato`;
        req.session.notification = notification;
        res.redirect('/guest');
    } else {
        mongodb_tools.deleteGuestById(req.body.guest_id, function (err) {
            if (err) {
                notification.show = true;
                notification.error = true;
                notification.message = `Impossibile recuperare l'invitato, controllare il log.`
                req.session.notification = notification;
                res.redirect('back');
            } else {
                console.log(`Guest correctly deleted`);
                res.redirect('/guest');
            }
        });
    }
}