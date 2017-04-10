var fileSchema = require('../lib/fileSchema');
var userModel = require('./userModel');
var config = require('config');
var mongoose = require('mongoose'); // mongoose for mongodb
mongoose.Promise = global.Promise; // solve Mongoose: mpromise (mongoose's default promise library) is deprecated
mongoose.connect(config.get('mongodb'));
// userModel相当于一个构造函数
fileModel = mongoose.model('fileModel', fileSchema);

module.exports = {
    create: function(file, author) {
        console.log("I am in create");
        return fileModel.create(file, function(err, data) {
            if (err)
                console.log("create file error");
        });
    },
    getDataByFilenameAndAuthor: function(findObj) {
        return fileModel.find(findObj, function(err, docs) {
            if (err) {
                console.log("Error:" + err);
            }
        });
    },
    updateFile: function(myfile, newfile) {
        console.log("I am updateFile");
        fileModel.update(myfile, newfile, function(err, data) {
            if (err)
                console.log("updateFile error");
        });
    }
};
