/* Tools for managing mondodb */

// Loading modules
var mongoClient = require('mongodb').MongoClient;

// Constants
const PORT = 27017;
const DB_URL = "mongodb://database-link:27017/site";
const COLL_GUEST ='Guest-List';

// Exports
module.exports = {
    initdb: function init_db(callback) {
        connect_db(function (err, db) {
            if (err) {
                console.log(err);
            } else {
                console.log('Database connection established');
                db.createCollection(COLL_GUEST, {
                    strict: true
                }, function (err, collection) {
                    if (err) {
                        console.log('Collection already existing');
                        var response = {
                            body: 'KO'
                        }
                        return callback(err, response);
                    } else {
                        console.log('Collection created successfully');
                        var response = {
                            body: "OK"
                        }
                        return callback(null, response);
                    }
                })
            }
        })
    },

//Snippet
    createuser: connect_db()
}

//Connects to db, if there's an error throws it
function connect_db(callback) {
    mongoClient.connect(DB_URL, function (err, db) {
        if (err) {
            console.log(err.stack || err.message);
            return callback(err, null);
        }
        return callback(null, db);
    });
}

//Snippet
//Creating user on database upon new user request
function create_user(err, db) {
    if (err) {
        console.log(err);
    } else if (db) {
        db.collection('Users', function (err, collection) {
            if (err) throw err;

            var dbCount = connection.db.collection('Users').count();
            collection.insert({
                id: dbCount + 1,
                firstname: req.body.first_name,
                lastname: req.body.last_name,
                email: req.body.email,
                login: req.body.login,
                pswd: req.body.password
            })
        });
    }
    return;
}