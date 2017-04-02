var config = require('config');
var mongoose = require('mongoose'); // mongoose for mongodb
mongoose.Promise = global.Promise; // solve Mongoose: mpromise (mongoose's default promise library) is deprecated
mongoose.connect(config.get('mongodb'));

// User
exports.User = mongoose.model('User', {
    email: {
        type: String,
        unique: true
    },
    password: String,
    name: String,
    time: {
        type: Date,
        default: Date.now
    },
    avatar: {
        type: String,
        default: 'img/avatar.png'
    },
    description: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'user'
    }
});

// Leaf
exports.Leaf = mongoose.model('Leaf', {});

// nodeData
exports.NodeData = mongoose.model('NodeData', {});
