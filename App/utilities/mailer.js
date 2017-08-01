const nodemailer = require('nodemailer');

var mailConfig = {
    pool: false,
    host: mail_settings.host,
    port: mail_settings.port,
    secure: false, // use TLS
    auth: {
        user: mail_settings.user,
        pass: mail_settings.password
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
    
    Ciao ${guest.name} ${guest.surname},
    con immensa gioia vogliamo invitarti al nostro matrimonio,
    che si terrà Domenica 8 ottobre 2017 alle ore 11:30 presso i fienili del Campiaro
    situati in località Campiaro, numero 112/c, 40030 Grizzana Morandi (BO).
    
    Dopo la cerimonia civile festeggeremo insieme presso l'adiacente ristorante Locanda dei fienili del Campiaro.

    Troverai tutti i dettagli sul nostro sito: 
    ${site.main}
    
    Ti chiediamo la cortesia di confermarci per tempo la tua presenza.
    Potrai farlo comodamente sulla pagina:
    ${site.rsvp}
    Per confermare ti verranno richiesti la mail (usa la stessa sulla quale hai ricevuto questo invito) ed il seguente token di autenticazione:
    ${guest.generated_token}
    
    Per qualunque informazione o richiesta puoi contattarci direttamente tramite il sito.
    
    Ti aspettiamo!
    Un abbraccio,
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
                from: mail_settings.mail,
                to: value.email,
                subject: 'Invito matrimonio Alessandro e Maria Francesca',
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