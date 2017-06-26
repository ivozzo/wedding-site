/* Wedding site */

// Loading modules
var index_router = require('./routers/router_main'),
    console_router = require('./routers/router_console'),
    express = require('express'),
    pug = require('pug')
    bodyParser = require('body-parser');

// Constants
const PORT = 8021;

// Notification
global.notification = {
    show: false,
    error: false,
    message: ''
}

// Variables
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/', index_router);
app.use('/console', console_router);
app.set('view engine', 'pug')

/* 
Defining the wedding site 
*/
var weddingsite = app.listen(PORT, function() {
    var host = weddingsite.address().address;
    var port = weddingsite.address().port;

    console.log('Wedding site listening on host %s, port %s', host, port);
});
