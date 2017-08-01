// Loading Modules
const express = require('express'),
    router = express.Router(),
    mongodb_toolstools = require('../utilities/mongodb'),
    mailer = require('../utilities/mailer');

router.post('/verify', function (req, res) {
    console.log(`POST: /verify - veryfing SMTP connection...`);
    mailer.test(function (err, success) {
        if (err) {
            console.log('Cannot connect to the SMTP server');

            notification.show = true;
            notification.error = true;
            notification.message = 'Impossibile connettersi al server di posta';

            req.session.notification = notification;
            res.render('console.pug', notification);
        } else {
            console.log('SMTP connection established');

            notification.show = true;
            notification.error = false;
            notification.message = 'SMTP connection established';

            req.session.notification = notification;
            res.render('console.pug', notification);
        }
    });
});

router.post('/send', function (req, res) {
    console.log(`POST: /mail/send`);
    console.log(`Getting the guest list`);
    mongodb_toolstools.listGuest(function (err, response) {
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
            if (response.error === true && response.body === 'query') {
                console.log('Error retrieving guests list')
                notification.show = true;
                notification.error = false;
                notification.message = 'Errore durante il reperimento della lista degli invitati';

                req.session.notification = notification;
                res.render('console.pug', {
                    notification: notification
                });
            } else if (response.error === false && response.body === 'guests') {
                console.log('Guest list obtained, now sending mails...');

                var info_list = mailer.send(response.guests);
                var notification_message = ``;

                info_list.forEach(function (info) {

                    if (info.success === true) {
                        notification_message = notification_message + `Invio OK: ${info.email}
                        `
                    }
                    if (info.error === true) {
                        notification_message = notification_message + `Invio KO: ${info.email}
                        `
                    }
                });

                notification.show = true;
                notification.error = false;
                notification.message = notification_message;
                req.session.notification = notification;

                res.render('console.pug', {
                    notification: notification
                })
            }
        }
    });
});

module.exports = router;