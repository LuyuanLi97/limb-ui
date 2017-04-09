var config = require('config');
var mongoose = require('mongoose'); // mongoose for mongodb
mongoose.Promise = global.Promise; // solve Mongoose: mpromise (mongoose's default promise library) is deprecated
mongoose.connect(config.get('mongodb'));

var nodeSchema = mongoose.Schema({
    nodeId: {
        type: String,
        unique: true
    },
    authorEmail: {
        type: String,
        default: ''
    },
    time: {
        type: Date,
        default: Date.now
    },
    tags: {
        type: String,
        default: 'tags'
    },
    description: {
        type: String,
        default: ''
    },
    notes: {
        type: String,
        default: ''
    },
    documents: {
        type: Array,
        default: []
    },
    plans: {
        type: Array,
        default: []
    },
    comments: {
        type: Array,
        default: []
    }
});

module.exports = nodeSchema;
