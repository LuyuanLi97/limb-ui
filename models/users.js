var User = require('../lib/mongo').User;

module.exports = {
    // create an user
    create: function create(user) {
        return User.create(user);
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
