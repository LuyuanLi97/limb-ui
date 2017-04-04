var config = require('config');
var mongoose = require('mongoose'); // mongoose for mongodb
mongoose.Promise = global.Promise; // solve Mongoose: mpromise (mongoose's default promise library) is deprecated
mongoose.connect(config.get('mongodb'));

// User
exports.userModel = mongoose.model('User', {
    email: {
        type: String,
        unique: true
    },
    password: String,
    name: {
        type: String,
        unique: true
    },
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
    },
    leaves: {
        type: Array,
        default: []
    }
});

// Leaf
// exports.Leaf = mongoose.model('Leaf', {});

// nodeData
// exports.NodeData = mongoose.model('NodeData', {});
