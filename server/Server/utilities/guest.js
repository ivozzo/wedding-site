const mongodb_tools = require('./mongodb'),
    objects = require('./objects');

module.exports = {
    insertGuest: function (req, res) {
        insert_Guest(req, res);
    },

    listGuest: function (req, res) {
        list_Guests(req, res);
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

    var guest = objects.Guest(
        req.body.Name,
        req.body.Surname,
        req.body.Email,
        req.body.Expected);

    //add the guest to the collection
    mongodbtools.createGuest(guest, function (err, response) {
        if (err) {
            console.log("Cannote create Guest object on database")
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

    res.render('console.pug', {
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
    mongodbtools.listGuest(function (err, response) {
        if (err) {
            console.log('Impossibile recuperare la lista degli invitati');

            notification.show = true;
            notification.error = true;
            notification.message = 'Impossibile recuperare la lista degli invitati';

            res.render('console.pug', {
                notification: notification
            });
        } else {
            if (response.error === true && response.body === 'query') {
                notification.show = true;
                notification.error = false;
                notification.message = 'La lista degli invitati risulta vuota';

                res.render('console.pug', {
                    notification: notification
                });
            } else if (response.error === false && response.body === 'guests') {
                console.log('Recuperata la lista degli ospiti');

                res.render('list.pug', {
                    headers: response.headers,
                    notification: notification,
                    guests: response.guests
                });
            }
        }
    });
}