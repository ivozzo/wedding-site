const secret_key = 'I love cupcakes',
    crypto = require('crypto'),
    base64url = require('base64url');

module.exports = {
    Guest: function (name_given, surname_given, email_given, expected_number_given) {
        var guest = Guest(name_given, surname_given, email_given, expected_number_given);
        return guest;
    },

    User: function (name_given, surname_given, email_given, username_given, password_given) {
        var user = User(name_given, surname_given, email_given, username_given, password_given);
        return user;
    },

    cryptPassword: function (password_given) {
        var password = hmac_password(password_given);
        return password;
    }
}

/**
 * Create a random authentication token
 * @function randomStringAsBase64Url
 * @param  {Integer} size {The size of the token}
 * @return {base64}
 */
function randomStringAsBase64Url(size) {
    return base64url(crypto.randomBytes(size));
}

/**
 * Create a Guest object
 * @function Guest
 * @param  {String} name_given            {Guest name}
 * @param  {String} surname_given         {Guest surname}
 * @param  {String} email_given           {Guest mail}
 * @param  {String} expected_number_given {Guests expected number}
 * @return {Guest}
 */
function Guest(name_given, surname_given, email_given, expected_number_given, skip_mail, attendance_given) {
    var guest = {
        name: name_given,
        surname: surname_given,
        email: email_given,
        skip_mail: skip_mail,
        generated_token: randomStringAsBase64Url(12),
        expected_number: expected_number_given,
        attendance: attendance_given
    };

    return guest;
}

/**
 * Create a User object
 * @function User
 * @param  {String} name_given     {User name}
 * @param  {String} surname_given  {User surname}
 * @param  {String} email_given    {User email}
 * @param  {String} username_given {User username}
 * @param  {String} password_given {User password}
 * @return {User}
 */
function User(name_given, surname_given, email_given, username_given, password_given) {

    var user = {
        name: name_given,
        surname: surname_given,
        email: email_given,
        username: username_given,
        password: hmac_password(password_given)
    };

    return user;
}

/**
 * Password crypting function
 * @function hmac_password
 * @param  {String} password_given {The original password}
 * @return {hex}
 */
function hmac_password(password_given) {
    var hmac = crypto.createHmac('sha256', secret_key);

    hmac.update(password_given);
    return hmac.digest('hex');
}