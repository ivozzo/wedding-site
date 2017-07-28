const nodemailer = require('nodemailer');

let mailConfig = {
    pool: false,
    host: 'AAA',
    port: 25,
    secure: false, // use TLS
    auth: {
        user: 'YYY',
        pass: 'XXX'
    }
};

var transporter = nodemailer.createTransport(mailConfig);

module.exports = {
    test: function (callback) {
        test_connection(callback);
    },

    send: function (guest_list) {
        return send_mail(guest_list);
    }
}

/**
 * Tests SMTP connection to the mail server
 * @function test_connection
 * @param  {Function} callback {The callback function}
 * @return {callback}
 */
function test_connection(callback) {
    transporter.verify(function (error, success) {
        if (error) {
            console.log(error);
            return callback(error, null);
        } else {
            console.log('It works!!!');
            return callback(null, success);
        }
    });
};

/**
 * Create the mail using the template and the variables passed
 * @function get_mail
 * @param  {Guest} guest {The guest object}
 * @param  {Site} site  {The site object}
 * @return {String} {The compiled mail}
 */
function get_mail(guest, site) {
    var email = `
    Invito per matrimonio
    
    Ciao ${guest.name} ${guest.surname},
    con piacere ed infinita gioia vogliamo invitarti al nostro matrimonio, che si terrà in data 8 ottobre 2017.
    
    Troverai tutti i dettagli sul luogo e sull'ora sul nostro sito: 
    ${site.main}
    
    Ti chiediamo la cortesia di confermarci per tempo la tua presenza.
    Potrai farlo comodamente sulla pagina:
    ${site.rsvp}
    Per confermare ti verranno richiesti la mail (usa la stessa sulla quale hai ricevuto questo invito) ed il seguente token di autenticazione:
    ${guest.generated_token}
    
    Ti aspettiamo!
    Alessandro e Maria Francesca`;

    return email;
};

/**
 * Send mail to all guests
 * @function send_mail
 * @param  {Array} guest_list {Array containing guests}
 * @return {Array} 
 */
function send_mail(guest_list) {

    var info_list = [];

    guest_list.forEach(function (value) {

        if (value.skip_email === false) {
            var mailOptions = {
                from: 'alessandroemariafrancesca@outlook.com',
                to: value.email,
                subject: 'Invito per matrimonio di Alessandro e Maria Francesca',
                text: get_mail(value, site)
            }

            transporter.sendMail(mailOptions);
            console.log(`Successfully sent mail to ${value.email}`);
            info_list.push({
                success: true,
                error: false,
                email: value.email
            });
            transporter.close;
        }
    });
    return info_list;
}