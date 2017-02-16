'use secret';

var UserModel = require('../models/users');

// Sign up
exports.signup = function(req, res) {
    console.log(req.body);
    var email = req.body.email;
    var password = req.body.password;

    // check
    try {
        if (password.length < 6) {
            throw new Error('密码至少 6 个字符');
        }
    } catch (e) {
        console.log(e.message);
        return;
    }

    // 待写入数据库的用户信息
    var user = {
        email: email,
        password: password
    };

    // 用户信息写入数据库
    UserModel.create(user)
        .then(function(user) {
            console.log('注册成功');
            // 将用户信息存入 session
            delete user.password;
            req.session.user = user;
            res.json({
                'email': email
            })
        });
};

// Sign in
exports.signin = function(req, res) {
    console.log(req.body);
    var email = req.body.email;
    var password = req.body.password;

    UserModel.getUserByEmail(email)
        .then(function(user) {
            if (!user) {
                console.log('用户不存在');
                return res.redirect('back');
            }
            if (password !== user.password) {
                console.log('邮箱或密码错误');
                return res.redirect('back');
            }
            console.log('登陆成功');
            delete user.password;
            req.session.user = user;
            res.json({
                'email': email
            })
        });
};

// Sign out
exports.signout = function(req, res, next) {
    req.session.destroy();
    res.redirect('/');
};

exports.checkSignin = function(req, res, next) {
    if (!!req.session.user) {
        res.json({
            'signedin': true
        });
    } else {
        res.json({
            'signedin': false
        })
    };
};
