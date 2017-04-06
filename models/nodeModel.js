var nodeSchema = require('../lib/nodeSchema');
var config = require('config');
var mongoose = require('mongoose'); // mongoose for mongodb
mongoose.Promise = global.Promise; // solve Mongoose: mpromise (mongoose's default promise library) is deprecated
mongoose.connect(config.get('mongodb'));
// nodeModel相当于一个构造函数
nodeModel = mongoose.model('nodeModel', nodeSchema);

module.exports = {
    create: function(node) {
        return nodeModel.create(node);
    },
    update: function(findObj, afterUpdate) {
        return nodeModel.update(findObj, afterUpdate, function(err, data) {
            if (err)
                console.log("update node err");
        });
    },

    // get node by nodeId
    getNodeByNodeId: function(nodeId) {
        return nodeModel.findOne({
            nodeId: nodeId
        });
    }
};
