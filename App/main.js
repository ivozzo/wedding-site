/* Wedding site */

// MongoDB Collection
global.myCollection = {
    guest: 'Guest-List',
    user: 'Users'
};

// Notification
global.notification = {
    show: false,
    error: false,
    message: ``
};

// Confirmation
global.confirmation = {
    show: false,
    message: ``
};

// Headers
global.titles = {
    title: `
Alessandro 
    & 
Maria Francesca`,
    subtitle: 'annunciano il loro matrimonio',
    main: 'Per guidarvi verso il nostro giorno felice'
};

// Site
if (process.env.NODE_SITE !== undefined) {
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

// Database connection url
global.DB_URL = '';
if (process.env.MONGO_URL !== undefined) {
    DB_URL = process.env.MONGO_URL;
} else {
    DB_URL = "mongodb://localhost:27017/site";
}

// Mail connection settings
global.mail_settings = {
    port: ((process.env.MAIL_PORT !== undefined) ? process.env.MAIL_PORT : 25),
    user: ((process.env.MAIL_USER !== undefined) ? process.env.MAIL_USER : 'XXX'),
    password: ((process.env.MAIL_PASSWORD !== undefined) ? process.env.MAIL_PASSWORD : 'YYY'),
    host: ((process.env.MAIL_HOST !== undefined) ? process.env.MAIL_HOST : 'XYX'),
    mail: ((process.env.MAIL_ADDRESS !== undefined) ? process.env.MAIL_ADDRESS : 'XYX')
}

// Site links
global.site = {
    main: `${node_site}`,
    rsvp: `${node_site}/guest/rsvp`,
    contact: `${mail_settings.mail}`
};

// Session
global.session = {
    logged: false,
    username: ``
}

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
    session = require('express-session'),
    favicon = require('serve-favicon');

// Variables
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'pug');
app.set("views", __dirname + "/public/views");
app.set("CSS", __dirname + "/public/CSS");
app.set("images", __dirname + "/public/images");
app.use(favicon(__dirname + "/public" + "/favicon.ico"));
app.use(express.static(__dirname + "/public"));
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
    console.log('Wedding site listening on host %s, port %s', node_site, PORT);
});