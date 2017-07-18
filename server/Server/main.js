/* Wedding site */

// Loading modules
const index_router = require('./routers/router_main'),
    console_router = require('./routers/router_console'),
    express = require('express'),
    pug = require('pug'),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session');

// Constants
const PORT = 8021;


// Constants
global.myCollection = {
    guest: 'Guest-List',
    user: 'Users'
}

// Notification
global.notification = {
    show: false,
    error: false,
    message: ''
}

// Headers
global.titles = {
    title: `
Alessandro 
    & 
Maria Francesca`,
    subtitle: 'Il lieto evento'
}

// Variables
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/', index_router);
app.use('/console', console_router);
app.set('view engine', 'pug');
app.use(cookieParser());
app.use(session({secret: 'secret-token-mika', saveUninitialized : false, resave : true}));


/* 
Defining the wedding site 
*/
var weddingsite = app.listen(PORT, function () {
    var host = weddingsite.address().address;
    var port = weddingsite.address().port;

    console.log('Wedding site listening on host %s, port %s', host, port);
});