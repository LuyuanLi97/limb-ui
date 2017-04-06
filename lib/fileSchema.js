var config = require('config');
var mongoose = require('mongoose'); // mongoose for mongodb
mongoose.Promise = global.Promise; // solve Mongoose: mpromise (mongoose's default promise library) is deprecated
mongoose.connect(config.get('mongodb'));

var fileSchema = mongoose.Schema({
    author: {
        type: String
    },
    filename: {
        type: String
    },
    isPrivate: {
        type: Boolean
    },
    data: {
        type: Object
    },
    rootname: {
        type: String,
        default: ""
    }
});

module.exports = fileSchema;
