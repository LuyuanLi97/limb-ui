'use secret';

var User = require('../lib/mongo').User;
var UserModel = require('../models/users');

// Sign up
exports.signup = function(req, res) {
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
        password: UserModel.createHashPassword(password),
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
    var email = req.body.email;
    var password = req.body.password;

    UserModel.getUserByEmail(email)
        .then(function(user) {
            try {
                if (!user) {
                    throw new Error('用户不存在');
                }
                if (!UserModel.validHashPassword(password, user.password)) {
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
    UserModel.getUserByEmail(req.params.userEmail)
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


exports.getNodeData = function(req, res, next) {
    if (req.params.nodeId == '模电homework') {
        return res.json({
            nodeId: '模电homework',
            author: {
                avatar: 'img/avatar.png',
                profile: '/browse/user/asdunfa@gmail.com',
                name: 'Larry',
                description: 'sophomore, at SYSU.',
                leavesNum: 4,
                tagsNum: 3,
                github: 'https://github.com/',
                mail: 'larry@gmail.com'
            },
            nodeString: ['作业汇总', '模电homework'],
            tags: '未完成,害怕',
            description: "模电，亦称‘魔电’。",
            notes: "我们来看一下这个单词是什么意思。——郭东亮",
            documents: [{
                name: 'first.css',
                date: '13, Mar, 2017',
                size: '1kb'
            }],
            plans: [{
                state: true,
                title: '作业一',
                content: '提交到课程网站上互评',
                deadline: '4, Mar. 2017'
            }],
            comments: [{
                avatar: 'http://bootdey.com/img/Content/user_1.jpg',
                date: 'Dec 18, 2014 ',
                name: 'chroslen',
                profile: '/browse/user/chroslen@gmail.com',
                content: '我爱学习'
            }]
        });
    }
    if (req.params.nodeId == '课程作业') {
        return res.json({
            nodeId: '课程作业',
            author: {
                avatar: 'img/avatar.png',
                profile: '/browse/user/asdunfa@gmail.com',
                name: 'Larry',
                description: 'sophomore, at SYSU.',
                leavesNum: 4,
                tagsNum: 3,
                github: 'https://github.com/',
                mail: 'larry@gmail.com'
            },
            nodeString: ['作业汇总', 'web2.0', '课程作业'],
            tags: '未完成,school',
            description: "this is a description.",
            notes: "Lato is free web-font designed by Lukasz Dziedzic from Warsaw. Here you can feel the color, size, line height and margins between paragraphs. Don’t forget to underline your links, they are an important visual marker for users.",
            documents: [{
                name: '06-physics.pdf',
                date: '17, Mar, 2017',
                size: '2Mb'
            }, {
                name: 'Jacob.css',
                date: '13, Mar, 2017',
                size: '1kb'
            }, {
                name: 'Larry.rmvb',
                date: '15, Mar, 2017',
                size: '234Mb'
            }],
            plans: [{
                state: true,
                title: '实验一',
                content: '到实验室完成实验一',
                deadline: '4, Mar. 2017'
            }, {
                state: false,
                title: '实验二',
                content: '到实验室完成实验二',
                deadline: '11, Mar. 2017'
            }],
            comments: [{
                avatar: 'http://bootdey.com/img/Content/user_1.jpg',
                date: 'Dec 18, 2014 ',
                name: 'chroslen',
                profile: '/browse/user/chroslen@gmail.com',
                content: '作业好多，感觉要gg'
            }]
        });
    } else if (req.params.nodeId == 'web2.0') {
        return res.json({
            nodeId: 'web2.0',
            author: {
                avatar: 'img/avatar.png',
                profile: '/browse/user/asdunfa@gmail.com',
                name: 'Larry',
                description: 'sophomore, at SYSU.',
                leavesNum: 4,
                tagsNum: 3,
                github: 'https://github.com/',
                mail: 'larry@gmail.com'
            },
            nodeString: ['作业汇总', 'web2.0'],
            tags: '未完成, 王青',
            description: "web课程,大二上",
            notes: "此时 chrome 横空出世，将 ie 和火狐干翻在地。——王青",
            documents: [{
                name: 'first.css',
                date: '13, Mar, 2017',
                size: '1kb'
            }, {
                name: '真正的coder.mp4',
                date: '15, Mar, 2017',
                size: '234Mb'
            }],
            plans: [{
                state: true,
                title: '作业一',
                content: '提交到课程网站上互评',
                deadline: '4, Mar. 2017'
            }],
            comments: [{
                avatar: 'http://bootdey.com/img/Content/user_1.jpg',
                date: 'Dec 18, 2014 ',
                name: 'chroslen',
                profile: '/browse/user/chroslen@gmail.com',
                content: '王青老师好强壮啊'
            }, {
                avatar: 'http://bootdey.com/img/Content/user_2.jpg',
                date: 'Dec 19, 2014 ',
                name: 'Asdunfa',
                profile: '/browse/user/asdunfa@gmail.com',
                content: '链接出了问题，真正的coder的视频还在吗',
                children: [{
                    avatar: 'http://bootdey.com/img/Content/user_3.jpg',
                    date: 'Dec 19, 2014 ',
                    name: 'guest',
                    profile: '/browse/user/asdunfa@gmail.com',
                    content: '同求'
                }]
            }]
        });
    } else {
        return res.json({
            nodeId: '作业汇总',
            author: {
                avatar: 'img/avatar.png',
                profile: '/browse/user/asdunfa@gmail.com',
                name: 'Larry',
                description: 'sophomore, at SYSU.',
                leavesNum: 4,
                tagsNum: 3,
                github: 'https://github.com/',
                mail: 'larry@gmail.com'
            },
            nodeString: ['作业汇总'],
            tags: 'sophomore,tag,bug',
            description: "大二上的所有作业",
            notes: "# notes \n这是`根节点`，没有选中其他节点就会显示跟节点的数据。",
            documents: [{
                name: '学期总结.html',
                date: '13, Mar, 2017',
                size: '1kb'
            }],
            plans: [{
                state: true,
                title: '运动计划',
                content: '提交到课程网站上互评',
                deadline: '4, Mar. 2017'
            }],
            comments: [{
                avatar: 'http://bootdey.com/img/Content/user_1.jpg',
                date: 'Dec 18, 2014 ',
                name: 'Asdunfa',
                profile: '/browse/user/asdunfa@gmail.com',
                content: '沙发'
            }, {
                avatar: 'http://bootdey.com/img/Content/user_2.jpg',
                date: 'Dec 19, 2014 ',
                name: 'Asdunfa',
                profile: '/browse/user/asdunfa@gmail.com',
                content: '我是楼上，不信看我的名字',
                children: [{
                    avatar: 'http://bootdey.com/img/Content/user_3.jpg',
                    date: 'Dec 19, 2014 ',
                    name: 'Asdunfa',
                    profile: '/browse/user/asdunfa@gmail.com',
                    content: '楼主说得有道理'
                }]
            }]
        });
    };
};
