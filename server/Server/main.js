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
if (process.env.NODE_SITE !== undefined){
    node_site = process.env.NODE_SITE;
} else {
    node_site = "http://localhost";
}

// Port
if (process.env.NODE_PORT !== undefined) {
    PORT = process.env.NODE_PORT;
} else {
    PORT = 8021;
}

// Connection string
global.DB_URL='';
if (process.env.MONGO_URL !== undefined) {
    DB_URL = process.env.MONGO_URL;
} else {
    DB_URL = "mongodb://localhost:27017/site";
}

global.site = {
    main: `${node_site}/`,
    rsvp: `${node_site}/rsvp`
};

// Variables
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'pug');
app.use(cookieParser());
app.use(session({
    secret: 'secret-token-mika',
    saveUninitialized: false,
    resave: true
}));
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