/* Tools for managing mondodb */

// Loading modules
const mongoClient = require('mongodb').MongoClient,
    objects = require('./objects')

// Exports
module.exports = {
    checkInitialized: function (callback) {
        check_Initialized(callback);
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

    listGuest: function (callback) {
        list_Guests(callback);
    },

    findUser: function (user, callback) {
        find_User(user, callback);
    },

    updateUser: function (user, callback) {
        update_User(user, callback);
    },

    updateGuest: function (guest, callback) {
        update_Guest(guest, callback);
    },

    findGuest: function (guest, callback) {
        find_Guest(guest, callback);
    },

    findGuestById: function(id, callback){
        find_GuestById(id, callback);
    },

    findGuestByEmail: function (guest, callback) {
        find_Guest_by_email(guest, callback);
    },

    updateGuestRSVP: function (guest, callback) {
        update_Guest_rsvp(guest, callback);
    }
}

/**
 * Connects to the database
 * @function connect_db
 * @param  {Function} callback {The callback function}
 * @return {callback}
 */
function connect_db(callback) {
    mongoClient.connect(DB_URL, function (err, db) {
        if (err) {
            console.error(err.stack || err.message);
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
            console.error(err);
        } else {
            db.createCollection(collection_req, {
                strict: true
            }, function (err, collection) {
                if (err) {
                    console.error(err);
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
            console.error(err);
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
                "login.user": user.username
            }).toArray(function (err, items) {
                if (err) {
                    console.error(err);
                    var response = {
                        error: true,
                        body: 'query',
                        users: null,
                        headers: null
                    }
                    db.close();
                    return callback(err, response);
                } else {
                    var response = {
                        error: false,
                        body: 'user',
                        users: null,
                        headers: null
                    }
                    response.users = items;

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
            console.error(err);
            var response = {
                body: 'KO'
            }
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
            console.error(err);
            var response = {
                body: 'KO'
            }
            return callback(err, response);
        } else {
            var collection = db.collection(myCollection.guest);

            collection.insertOne({
                "email": guest.email,
                "skip_mail": guest.skip_mail,
                "expected_number": guest.expected_number,
                "surname": guest.surname,
                "name": guest.name,
                "generated_token": guest.generated_token,
                "attendance": guest.attendance
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
 * Check if the database has already been initialized
 * @function check_Initialized
 * @param  {Function} callback {The callback function}
 * @return {callback}
 */
function check_Initialized(callback) {
    connect_db(function (err, db) {
        if (err) {
            console.error(err);
            return callback(err, null);
        } else {
            var collection = db.collection(myCollection.user);

            collection.find().toArray(function (err, items) {
                if (items.length === 0) {
                    console.log(`No users have been found, creating the admin user, please change password`);

                    var user = objects.User(
                        "Alessandro",
                        "Ivaldi",
                        "alessandro.ivaldi@email.it",
                        "aivaldi",
                        "password"
                    )

                    create_User(user, function (err, response) {
                        if (err) {
                            console.error(err);
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
}

/**
 * List all available guests
 * @function list_Guests
 * @param  {Function} callback {The callback function}
 * @return {callback}
 */
function list_Guests(callback) {
    connect_db(function (err, db) {
        if (err) {
            console.error(err);
            var response = {
                error: true,
                body: 'KO',
                guests: null,
                headers: null
            }
            return callback(err, response);
        } else {
            var collection = db.collection(myCollection.guest);

            collection.find().toArray(function (err, items) {
                if (err) {
                    console.error(err);
                    var response = {
                        error: true,
                        body: 'query',
                        guests: null,
                        headers: null
                    }
                    db.close();
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
                            id: item.id,
                            name: item.name,
                            surname: item.surname,
                            email: item.email,
                            skip_email: item.skip_email,
                            generated_token: item.generated_token,
                            expected_number: item.expected_number,
                            attendance: item.attendance
                        }
                        response.guests.push(guest);
                    }

                    response.headers = ["Nome", "Cognome", "Email", "Non inviare mail", "Invitati attesi", "Parteciperà", "Token"];
                    db.close();
                    return callback(null, response);
                }
            });
        }
    })
}

/**
 * Updates user password
 * @function update_User
 * @param  {User} user     {The user to update}
 * @param  {Function} callback {The callback function}
 * @return {callback}
 */
function update_User(user, callback) {
    connect_db(function (err, db) {
        if (err) {
            console.error(err);
            var response = {
                error: true,
                body: 'KO',
                users: null,
                headers: null
            }
            return callback(err, response);
        } else {
            var collection = db.collection(myCollection.user);

            collection.save(user, function (err, status) {
                if (err) {
                    console.error(err);

                    var response = {
                        error: true,
                        body: 'update',
                        users: null,
                        headers: null
                    }
                    db.close();
                    return callback(err, response);
                } else {
                    db.close();
                    return callback(null, response);
                }
            })

        }
    });
}

/**
 * Search for a guest
 * @function find_Guest
 * @param  {Guest} guest     {The guest to search for}
 * @param  {Function} callback {The callback function}
 * @return {callback}
 */
function find_Guest(guest, callback) {
    connect_db(function (err, db) {
        if (err) {
            console.error(err);
            var response = {
                error: true,
                body: 'KO',
                users: null,
                headers: null
            }
            return callback(err, response);
        } else {
            var collection = db.collection(myCollection.guest);

            collection.find({
                "name": guest.name,
                "surname": guest.surname,
            }).toArray(function (err, items) {
                if (err) {
                    console.error(err);
                    var response = {
                        error: true,
                        body: 'query',
                        guests: null,
                        headers: null
                    }
                    db.close();
                    return callback(err, response);
                } else {
                    var response = {
                        error: false,
                        body: 'guest',
                        guests: null,
                        headers: null
                    }
                    response.guests = items;

                    db.close();
                    return callback(null, response);
                }
            });
        }
    });
}

/**
 * Search for a guest
 * @function find_Guest_by_email
 * @param  {Guest} guest     {The guest to search for}
 * @param  {Function} callback {The callback function}
 * @return {callback}
 */
function find_Guest_by_email(guest, callback) {
    connect_db(function (err, db) {
        if (err) {
            console.error(err);
            var response = {
                error: true,
                body: 'KO',
                users: null,
                headers: null
            }
            return callback(err, response);
        } else {
            var collection = db.collection(myCollection.guest);

            collection.find({
                "email": guest.email
            }).toArray(function (err, items) {
                console.log(items)
                if (err) {
                    console.error(err);
                    var response = {
                        error: true,
                        body: 'query',
                        guests: null,
                        headers: null
                    }
                    db.close();
                    return callback(err, response);
                } else {
                    var response = {
                        error: false,
                        body: 'guest',
                        guests: items,
                        headers: null
                    }

                    db.close();
                    return callback(null, response);
                }
            });
        }
    });
}

/**
 * Updates guest fields from rsvp page
 * @function update_Guest_rsvp
 * @param  {Guest} guest     {The guest to update}
 * @param  {Function} callback {The callback function}
 * @return {callback}
 */
function update_Guest_rsvp(guest, callback) {
    connect_db(function (err, db) {
        if (err) {
            console.error(err);
            var response = {
                error: true,
                body: 'KO',
                guests: null,
                headers: null
            }
            return callback(err, response);
        } else {
            var collection = db.collection(myCollection.guest);

            collection.save(guest, function (err, status) {
                if (err) {
                    var response = {
                        error: true,
                        body: 'update',
                        guests: null,
                        headers: null
                    }
                    db.close();
                    return callback(err, response);
                } else {
                    db.close();
                    return callback(null, response);
                }
            })

        }
    });
}

/**
 * Updates guest fields
 * @function update_Guest
 * @param  {Guest} guest     {The guest to update}
 * @param  {Function} callback {The callback function}
 * @return {callback}
 */
function update_Guest(guest, callback) {
    connect_db(function (err, db) {
        if (err) {
            console.error(err);
            var response = {
                error: true,
                body: 'KO',
                guests: null,
                headers: null
            }
            return callback(err, response);
        } else {
            var collection = db.collection(myCollection.guest);

            collection.save(guest, function (err, status) {
                if (err) {
                    var response = {
                        error: true,
                        body: 'update',
                        guests: null,
                        headers: null
                    }
                    db.close();
                    return callback(err, response);
                } else {
                    db.close();
                    return callback(null, response);
                }
            })

        }
    });
}

/**
 * Search for a guest by Id
 * @function find_GuestById
 * @param  {String} id     {The guest id to search for}
 * @param  {Function} callback {The callback function}
 * @return {callback}
 */
function find_GuestById(id, callback) {
    connect_db(function (err, db) {
        if (err) {
            console.error(err);
            var response = {
                error: true,
                body: 'KO',
                users: null,
                headers: null
            }
            return callback(err, response);
        } else {
            var collection = db.collection(myCollection.guest);

            collection.find({
                "id": id
            }).toArray(function (err, items) {
                if (err) {
                    console.error(err);
                    var response = {
                        error: true,
                        body: 'query',
                        guests: null,
                        headers: null
                    }
                    db.close();
                    return callback(err, response);
                } else {
                    var response = {
                        error: false,
                        body: 'guest',
                        guests: null,
                        headers: null
                    }
                    response.guests = items;

                    db.close();
                    return callback(null, response);
                }
            });
        }
    });
}