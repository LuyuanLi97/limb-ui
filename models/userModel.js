var userSchema = require('../lib/userSchema');
var config = require('config');
var mongoose = require('mongoose'); // mongoose for mongodb
mongoose.Promise = global.Promise; // solve Mongoose: mpromise (mongoose's default promise library) is deprecated
mongoose.connect(config.get('mongodb'));
var bcrypt = require('bcrypt');
// userModel相当于一个构造函数
userModel = mongoose.model('userModel', userSchema);

module.exports = {
    create: function (user) {
        return userModel.insert(user);
    },

    createHashPassword: function(password) {
        return bcrypt.hashSync(password, 10);
    },

    validHashPassword: function(password, passwordInDB) {
        return bcrypt.compareSync(password, passwordInDB);
    },

    // get user by email
    getUserByEmail: function (email) {
        return userModel.findOne({
            email: email
        });
    },

    // get user by name
    getUserByName: function (name) {
        return userModel.findOne({
            name: name
        });
    },

    getUsers: function () {
        return userModel.find({}, function(err, docs) {
            if (err) {
                console.log("Error:" + err);
            }
        });
    }
};
