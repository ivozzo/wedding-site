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
    if (req.body.template_id === "nil") {
        console.log(`No mail template selected`);
        notification.show = true;
        notification.error = true;
        notification.message = `Necessario selezionare un template mail per poter procedere con l'invio`
        res.redirect('/console');
    } else {
        console.log(`Getting the guest list`);
        mongodb_toolstools.listGuest(function (err, response) {
            if (err) {
                notification.show = true;
                notification.error = true;
                notification.message = `Impossibile recuperare la lista degli invitati`;
                req.session.notification = notification;
                res.redirect('/console');
            } else {
                console.log('Guest list obtained, now sending mails...');
                var info_list = mailer.send(response.guests, req.body.template_id);
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
    }
});

router.post('/sendtemplate', function (req, res) {
    console.log(`POST: /mail/sendtemplate`);
    if (req.body.guest_id === "nil") {
        console.log(`No guest selected`);
        notification.show = true;
        notification.error = true;
        notification.message = `Necessario selezionare un invitato per poter procedere con l'invio`
        res.redirect('/guest');
    } else {
        if (req.body.template_id === "nil") {
            console.log(`No mail template selected`);
            notification.show = true;
            notification.error = true;
            notification.message = `Necessario selezionare un template mail per poter procedere con l'invio`
            res.redirect('/guest');
        } else {
            console.log(`Getting the guest list`);
            mongodb_toolstools.findGuestById(req.body.guest_id, function (err, guest) {
                if (err) {
                    notification.show = true;
                    notification.error = true;
                    notification.message = `Impossibile recuperare l'invitato`;
                    req.session.notification = notification;
                    res.redirect('/guest');
                } else {
                    console.log('Guest data obtained, now sending mail...');
                    var info_list = mailer.send([guest], req.body.template_id);
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
                    res.redirect('/guest');
                }
            });
        }
    }
});
module.exports = router;