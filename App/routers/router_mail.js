// Loading Modules
const express = require('express'),
    router = express.Router(),
    mongodb_toolstools = require('../utilities/mongodb'),
    mailer = require('../utilities/mailer');

router.post('/verify', function (req, res) {
    console.log(`POST: /verify - veryfing SMTP connection...`);
    mailer.test(function (err, success) {
        if (err) {
            notification.show = true;
            notification.error = true;
            notification.message = 'Impossibile connettersi al server di posta';
            req.session.notification = notification;
            res.redirect('/console');
        } else {
            notification.show = true;
            notification.error = false;
            notification.message = 'Connessione SMTP riuscita';
            req.session.notification = notification;
            res.redirect('/console');
        }
    });
});

router.post('/send', function (req, res) {
    console.log(`POST: /mail/send`);
    console.log(`Getting the guest list`);
    mongodb_toolstools.listGuest(function (err, response) {
        if (err) {
            notification.show = true;
            notification.error = true;
            notification.message = 'Impossibile recuperare la lista degli invitati';
            req.session.notification = notification;
            res.redirect('/console');
        } else {
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
            res.redirect('/console');
        }
    });
});

module.exports = router;