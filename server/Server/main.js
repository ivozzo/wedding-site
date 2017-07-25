/* Wedding site */

// Loading modules
const index_router = require('./routers/router_main'),
    console_router = require('./routers/router_console'),
    login_router = require('./routers/router_login'),
    mail_router = require('./routers/router_mail'),
    guest_router = require('./routers/router_guest'),
    user_router = require('./routers/router_user'),
    express = require('express'),
    pug = require('pug'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session');

// Constants
const PORT = 8021;

// Constants
global.myCollection = {
    guest: 'Guest-List',
    user: 'Users'
};

// Notification
global.notification = {
    show: false,
    error: false,
    message: ''
};

// Headers
global.titles = {
    title: `
Alessandro 
    & 
Maria Francesca`,
    subtitle: 'Il lieto evento'
};

// Site
global.site = {
    main: "http://pagina principale",
    rsvp: "http://pagina_rsvp"
};

// Variables
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'pug');
app.use(cookieParser());
app.use(session({secret: 'secret-token-mika', saveUninitialized : false, resave : true}));
app.use('/', index_router);
app.use('/console', console_router);
app.use('/login', login_router);
app.use('/mail', mail_router);
app.use('/guest', guest_router);
app.use('/user', user_router);

// Starting server
var weddingsite = app.listen(PORT, function () {
    var host = weddingsite.address().address;
    var port = weddingsite.address().port;

    console.log('Wedding site listening on host %s, port %s', host, port);
});