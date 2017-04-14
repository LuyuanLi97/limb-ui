var config = require('config');
var mongoose = require('mongoose'); // mongoose for mongodb
mongoose.Promise = global.Promise; // solve Mongoose: mpromise (mongoose's default promise library) is deprecated
mongoose.connect(config.get('mongodb'));

// 测试db连接是否成功
var db = mongoose.connection;
// 连接失败
db.on('error', function() {
  console.log("connect mongodb error");
});

// 连接成功
db.once('open', function() {
  console.log("connect mongodb success!");
});

var userSchema = mongoose.Schema({
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
    // 文件包括自己创建和克隆
    fileList: {
        type: Array,
    },
    starList: {
        type: Array,
    }
});

module.exports = userSchema;
