var User = require('../lib/mongo').User;
var bcrypt = require('bcrypt');

module.exports = {
    // create an user
    create: function create(user) {
        return User.create(user);
    },

    createHashPassword: function(password) {
        return bcrypt.hashSync(password, 10);
    },

    validHashPassword: function(password, passwordInDB) {
        return bcrypt.compareSync(password, passwordInDB);
    },

    // get user by email
    getUserByEmail: function getUserByEmail(email) {
        return User.findOne({
            email: email
        });
    },

    // get user by name
    getUserByName: function getUserByName(name) {
        return User.findOne({
            name: name
        });
    },

    getUsers: function getUsers() {
        return User.find({}, function(err, docs) {
            if (err) {
                console.log("Error:" + err);
            }
        });
    }
};
