/* Tools for managing mondodb */

// Loading modules
var mongoClient = require('mongodb').MongoClient;

// Constants
const PORT = 27017,
    DB_URL = "mongodb://localhost:27017/site";

// Exports
module.exports = {
    checkInitialized: function check_Initialized(callback) {
        connect_db(function (err, db) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                var collection = db.collection(myCollection.user);

                collection.find().toArray(function (err, items) {
                    if (items.length === 0) {
                        console.log(`No users have been found, creating the admin user, please change password`);

                        var user = {
                            name: "Alessandro",
                            surname: "Ivaldi",
                            email: "alessandro@email.it",
                            username: "aivaldi",
                            password: "password"
                        }

                        create_User(user, function (err, response) {
                            if (err) {
                                console.log("Error creating user")
                                db.close();
                                return callback(err, null);
                            } else {
                                console.log("The user has been created");
                                db.close();
                                return callback(err, response);
                            }
                        });
                    }
                });
            }
        });
    },

    initCollection: function (collection_req, callback) {
        init_db(collection_req, callback);
    },

    createGuest: function (guest, callback) {
        create_Guest(guest, callback);
    },

    createUser: function (user, callback) {
        create_User(user, callback);
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

    findUser: function (user, callback) {
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
                var collection = db.collection(myCollection.user);

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

/**
 * Database initialization
 * @function init_db
 * @param  {String} collection_req {The collection to initialize}
 * @param  {Function} callback       {The callback function}
 * @return {callback}
 */
function init_db(collection_req, callback) {
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
}

/**
 * Search for an user
 * @function find_User
 * @param  {User} user     {The user to search for}
 * @param  {Function} callback {The callback function}
 * @return {callback}
 */
function find_User(user, callback) {
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
            var collection = db.collection(myCollection.user);

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

                    db.close();
                    return callback(null, response);
                }
            });
        }
    });
}

/**
 * Create a user in the user collection
 * @function create_User
 * @param  {User} user           {The user to write onto the database}
 * @param  {Function} callback       {The callback function}
 * @return {callback}
 */
function create_User(user, callback) {
    connect_db(function (err, db) {
        if (err) {
            console.log(err);
            var response = {
                body: 'KO'
            }
            db.close();
            return callback(err, response);
        } else {
            var collection = db.collection(myCollection.user);

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
}

/**
 * Create a guest in the guest collection
 * @function create_Guest
 * @param  {Guest} guest    {The guest to write onto the database}
 * @param  {Function} callback {The callback function}
 * @return {callback}
 */
function create_Guest(guest, callback) {
    connect_db(function (err, db) {
        if (err) {
            console.log(err);
            var response = {
                body: 'KO'
            }
            db.close();
            return callback(err, response);
        } else {
            var collection = db.collection(myCollection.guest);

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
}