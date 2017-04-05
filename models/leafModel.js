var Leaf = require('../lib/mongo').Leaf;

module.exports = {
    // create an leaf
    create: function create(leaf) {
        return Leaf.create(leaf);
    },

    // ...
};
