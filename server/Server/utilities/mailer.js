const nodemailer = require('nodemailer');

let poolConfig = {
    pool: true,
    host: 'smtp.live.com',
    port: 25,
    secure: false, // use TLS
    auth: {
        user: 'alessandroemariafrancesca@outlook.com',
        pass: 'reyzKi17IivH'
    }
};

var transporter = nodemailer.createTransport(poolConfig);

module.exports = {
    test: function (callback) {
        test_connection(callback);
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
            return callback(err,null);
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
function get_mail(guest, site){
    var email = `
    Invito per matrimonio
    
    Ciao ${guest.name} ${guest.surname},
    è nostro piacere invitarti al nostro matrimonio che si terrà in data 8 ottobre 2017.
    
    Troverai tutti i dettagli sul nostro sito: 
    ${site.main}
    
    Ti chiediamo la cortesia di confermarci la tua presenza sulla pagina:
    ${site.rsvp}
    Ti verranno richiesti per confermare la mail (usa la stessa sulla quale hai ricevuto questa mail) ed il seguente token di autenticazione:
    ${guest.generated_token}
    
    Ti aspettiamo!
    Alessandro e Maria Francesca`;

    return email;
};

function send_mail(guest_list){

    for (var i = 0, len = guest_list.length; i < len; i++) {
        var mailOptions = {
            from: 'alessandroemariafrancesca@outlook.com',
            to: guest.email,
            subject: 'Invito per matrimonio di Alessandro e Maria Francesca',
            text: get_mail(guest,site)
        }
    }

}
//Snippet
//transporter.sendMail(mailOptions, function (error, info) {
//    if (error) {
//        console.log(error);
//    } else {
//        console.log('Email sent: ' + info.response);
//    }
//});