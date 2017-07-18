/* Tools for managing mondodb */

// Loading modules
var mongoClient = require('mongodb').MongoClient;

// Constants
const PORT = 27017,
    DB_URL = "mongodb://localhost:27017/site";

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
                        db.close();
                        return callback(err, response);
                    } else {
                        var response = {
                            body: "OK"
                        }
                        db.close();
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
                db.close();
                return callback(err, response);
            } else {
                var collection = db.collection(collection_req);

                collection.insertOne({
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
                    "login": {
                        "generated_token": guest.generated_token,
                        "login": guest.generated_login
                    }

                });
                var response = {
                    body: 'OK'
                }
                db.close();
                return callback(null, response);
            }
        })
    },

    createUser: function create_User(collection_req, user, callback) {
        connect_db(function (err, db) {
            if (err) {
                console.log(err);
                var response = {
                    body: 'KO'
                }
                db.close();
                return callback(err, response);
            } else {
                var collection = db.collection(collection_req);

                collection.insertOne({
                    "name": user.name,
                    "surname": user.surname,
                    "email": user.email,
                    "login": {
                        "user": user.username,
                        "password": user.password
                    }
                });
                var response = {
                    body: 'OK'
                }
                db.close();
                return callback(null, response);
            }
        })
    },

    listGuest: function list_Guests(collection_req, callback) {
        connect_db(function (err, db) {
            if (err) {
                console.log(err);
                var response = {
                    error: true,
                    body: 'KO',
                    guests: null,
                    headers: null
                }
                return callback(err, response);
            } else {
                var collection = db.collection(collection_req);

                collection.find().toArray(function (err, items) {
                    if (err) {
                        console.log(err);
                        var response = {
                            error: true,
                            body: 'query',
                            guests: null,
                            headers: null
                        }
                        return callback(err, response);
                    } else {
                        var response = {
                            error: false,
                            body: 'guests',
                            guests: [],
                            headers: null
                        }
                        for (var i in items) {
                            item = items[i];

                            var guest = {
                                id: item._id,
                                name: item.name,
                                surname: item.surname,
                                contacts: item.contacts,
                                address: item.address,
                                expected_number: item.expected_number
                            }
                            response.guests.push(guest);
                        }

                        response.headers = ["id", "name", "surname", "contacts", "address", "expected number"];
                        db.close();
                        return callback(null, response);
                    }
                });
            }
        })
    },

    findUser: function (collection_req, user, callback) {
        connect_db(function (err, db) {
            if (err) {
                console.log(err);
                var response = {
                    error: true,
                    body: 'KO',
                    users: null,
                    headers: null
                }
                return callback(err, response);
            } else {
                var collection = db.collection(collection_req);

                collection.find({
                    username: user.username
                }).toArray(function (err, items) {
                    if (err) {
                        console.log(err);
                        var response = {
                            error: true,
                            body: 'query',
                            guests: null,
                            headers: null
                        }
                        return callback(err, response);
                    } else {
                        var response = {
                            error: false,
                            body: 'user',
                            user: null,
                            headers: null
                        }
                        console.log(items);
                        response.user = items;

                        //for (var i in items) {
                        //    item = items[i];
                        //    var user = {
                        //        id: item._id,
                        //        name: item.name,
                        //        surname: item.surname,
                        //        email: item.email,
                        //        username: item.username,
                        //        password: item.password
                        //    }
                        //    response.users.push(user);
                        //}

                        db.close();
                        return callback(null, response);
                    }
                });
            }
        });
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