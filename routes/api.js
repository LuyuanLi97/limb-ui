'use secret';

var User = require('../lib/mongo').User;
var UserModel = require('../models/users');

// Sign up
exports.signup = function(req, res) {
    console.log(req.body);
    var email = req.body.email;
    var password = req.body.password;

    // check
    var emailForm = /^([\w-_]+(?:\.[\w-_]+)*)@((?:[a-z0-9]+(?:-[a-zA-Z0-9]+)*)+\.[a-z]{2,6})$/i;
    try {
        if (!emailForm.test(email)) {
            throw new Error('邮箱格式错误');
        }
        if (password.length < 6) {
            throw new Error('密码至少 6 个字符');
        }
    } catch (e) {
        console.log('sign up fail');
        return res.json({
            'status': false,
            'message': e.message
        });
    }
    UserModel.getUserByEmail(email)
        .then(function(user) {
            if (user) {
                return res.json({
                    'status': false,
                    'message': '用户已存在'
                })
            }
        });

    // 待写入数据库的用户信息
    var user = {
        email: email,
        password: password,
        name: "",
        description: "",
        avatar: "",
        type: "user"
    };

    // 用户信息写入数据库
    UserModel.create(user)
        .then(function(user) {
            console.log('注册成功');
            // 将用户信息存入 session
            delete user.password;
            req.session.user = user;
            return res.json({
                'status': true,
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
            try {
                if (!user) {
                    throw new Error('用户不存在');
                }
                if (password !== user.password) {
                    throw new Error('邮箱或密码错误');
                }
            } catch (e) {
                return res.json({
                    'status': false,
                    'message': e.message
                });
            }
            console.log('登陆成功');
            delete user.password;
            req.session.user = user;
            return res.json({
                'status': true,
                'email': email
            })
        });
};

// Sign out
exports.signout = function(req, res, next) {
    req.session.destroy();
    res.redirect('/');
};

exports.browse = function(req, res, next) {
    UserModel.getUsers()
        .then(users => {
            console.log(users);
            res.json(users);
        });
};

exports.myprofile = function(req, res, next) {
    if (!!req.session.user) {
        UserModel.getUserByEmail(req.session.user.email)
            .then(user => {
                res.json({
                    'name': user.name,
                    'email': user.email,
                    'description': user.description,
                });
            });
    }
};

exports.browse.user = function(req, res, next) {
    UserModel.getUserByName(req.params.userName)
        .then(user => {
            res.json({
                'name': user.name,
                'email': user.email,
                'description': user.description,
            });
        });
};

exports.settings = function(req, res, next) {
    if (!!req.session.user) {
        UserModel.getUserByEmail(req.session.user.email)
            .then(user => {
                res.json({
                    'name': user.name,
                    'email': user.email,
                    'description': user.description,
                });
            });
    }
};

exports.checkSignin = function(req, res, next) {
    if (!!req.session.user) {
        return res.json({
            'signedin': true
        });
    } else {
        return res.json({
            'signedin': false
        })
    };
};

// Update profile
exports.updateProfile = function(req, res, next) {
    console.log(req.body);
    var MyUser = User;
    if (req.body.name) {
        MyUser.update({
            email: req.session.user.email
        }, {
            name: req.body.name
        }, function(error) {});
    };
    if (req.body.email) {
        MyUser.update({
            email: req.session.user.email
        }, {
            email: req.body.email
        }, function(error) {});
        UserModel.getUserByEmail(req.body.email)
            .then(user => {
                req.session.user = user;
            });
    };
    if (req.body.description) {
        MyUser.update({
            email: req.session.user.email
        }, {
            description: req.body.description
        }, function(error) {});
    };

    UserModel.getUserByEmail(req.session.user.email)
        .then(user => {
            req.session.user = user;
        });
};

// Update avatar
exports.updateAvatar = function(req, res, next) {
    console.log(req.body);
};

// Update Account
exports.updateAccount = function(req, res, next) {
    console.log(req.body);
};
