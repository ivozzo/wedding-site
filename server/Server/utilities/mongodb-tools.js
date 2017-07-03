/* Tools for managing mondodb */

// Loading modules
var mongoClient = require('mongodb').MongoClient;

// Constants
const PORT = 27017;
const DB_URL = "mongodb://localhost:27017/site";

// Exports
module.exports = {
    initCollection: function init_db(collection_req, callback) {
        connect_db(function (err, db) {
            if (err) {
                console.log(err);
            } else {
                db.createCollection(collection_req, {
                    strict: true
                }, function (err, collection) {
                    if (err) {
                        var response = {
                            body: 'KO'
                        }
                        return callback(err, response);
                    } else {
                        var response = {
                            body: "OK"
                        }
                        return callback(null, response);
                    }
                })
            }
        })
    },

    createGuest: function create_Guest(collection_req, guest, callback) {
        connect_db(function (err, db) {
            if (err) {
                console.log(err);
                var response = {
                    body: 'KO'
                }
                return callback(err, response);
            } else {
                db.collection(collection_req).insertOne({
                    "address": {
                        //TODO
                    },
                    "contacts": {
                        "email": guest.email,
                        "phone number": ''
                    },
                    "expected number": guest.expected_number,
                    "surname": guest.surname,
                    "name": guest.name,
                    "generated_token": guest.generated_token
                });
                var response = {
                    body: 'OK'
                }
                return callback(null, response);
            }
        })
    }
}

//Connects to db, if there's an error log it and pass it back
function connect_db(callback) {
    mongoClient.connect(DB_URL, function (err, db) {
        if (err) {
            console.log(err.stack || err.message);
            return callback(err, null);
        }
        console.log('Database connection established');
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