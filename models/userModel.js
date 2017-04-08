var userSchema = require('../lib/userSchema');
var config = require('config');
var mongoose = require('mongoose'); // mongoose for mongodb
mongoose.Promise = global.Promise; // solve Mongoose: mpromise (mongoose's default promise library) is deprecated
mongoose.connect(config.get('mongodb'));
var bcrypt = require('bcryptjs');
// userModel相当于一个构造函数
userModel = mongoose.model('userModel', userSchema);

module.exports = {
    create: function(user) {
        return userModel.create(user, function(err, data) {
            if (err)
                console.log("create user err");
        });
    },
    update: function(findObj, afterUpdate) {
        return userModel.update(findObj, afterUpdate, function(err, data) {
            if (err)
                console.log("update user err");
        });
    },

    createHashPassword: function(password) {
        var salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    },

    validHashPassword: function(password, passwordInDB) {
        return bcrypt.compareSync(password, passwordInDB);
    },

    // get user by email
    getUserByEmail: function(email) {
        return userModel.findOne({
            email: email
        });
    },

    // get user by name
    getUserByName: function(name) {
        return userModel.findOne({
            name: name
        });
    },

    getUsers: function() {
        return userModel.find({}, function(err, docs) {
            if (err) {
                console.log("Error:" + err);
            }
        });
    }

    // getFile: function(filename) {
    //     return userModel.find({""})
    // }
};
