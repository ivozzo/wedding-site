//Loading Modules
const mongodb_tools = require('../utilities/mongodb');

module.exports = {
    initializeDatabase = function () {
        initialize_Database();
    }
}

function initialize_Database() {
    var error_user = false;
    var error_guest = false;

    //initializing COLL_USER collection, if the collection already exists return an error
    mongodb_tools.initCollection(myCollection.user, function (err, response) {
        if (err && response.body == 'KO') {
            console.log('Collection %s already existing', COLL_USER);
            error_user = true;
        } else {
            console.log('Collection %s has been correctly created', COLL_USER);
            var report_user = true;
        }
    });

    //initializing COLL_GUEST collection, if the collection already exists return an error
    mongodb_tools.initCollection(myCollection.guest, function (err, response) {
        if (err && response.body == 'KO') {
            console.log('Collection %s already existing', COLL_GUEST);
            error_guest = true;
        } else {
            console.log('Collection %s has been correctly created', COLL_GUEST);
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

    res.render('console.pug', {
        notification: notification
    });
}