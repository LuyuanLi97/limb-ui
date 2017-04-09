'use secret';

var userModel = require('../models/userModel');

// Auto sign in

const autoSignin = function(req, res, next) {
    console.log('auto signin');
    if (!!req.session.user) {
        console.log('success');
        userModel.getUserByEmail(req.session.user.email)
            .then(user => {
                res.locals.user = user;
                next();
            });
    } else {
        console.log('fail');
        res.locals.user = null;
        next();
    }
}

module.exports = autoSignin;
