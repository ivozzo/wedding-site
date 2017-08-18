//Loading Modules
const mongodb_tools = require('../utilities/mongodb');

module.exports = {
    initializeDatabase: function (req, res) {
        initialize_Database(req, res);
    }
}

function initialize_Database(req, res) {
    var error_user = false;
    var error_guest = false;

    //initializing COLL_USER collection, if the collection already exists return an error
    mongodb_tools.initCollection(myCollection.user, function (err, response) {
        if (err && response.body == 'KO') {
            console.warn('Collection %s already existing', myCollection.user);
            error_user = true;
        } else {
            console.log('Collection %s has been correctly created', myCollection.user);
            var report_user = true;
        }
    });

    //initializing COLL_GUEST collection, if the collection already exists return an error
    mongodb_tools.initCollection(myCollection.guest, function (err, response) {
        if (err && response.body == 'KO') {
            console.warn('Collection %s already existing', myCollection.guest);
            error_guest = true;
        } else {
            console.log('Collection %s has been correctly created', myCollection.guest);
            var report_guest = true;
        }
    })

    //If an error has been thrown prepare the error notification, else prepare the success notification
    if (error_user === true && error_guest === true) {
        notification.show = true;
        notification.error = true;
        notification.message = `Il database è già stato inizializzato. 
Impossibile creare le collection.`;

    } else {
        notification.show = true;
        notification.error = false;
        notification.message = `Il database è stato correttamente inizializzato.`;
    }

    req.session.notification = notification;
    res.render('console.pug', {
        notification: notification
    });
}