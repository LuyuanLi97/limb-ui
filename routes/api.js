'use secret';

var userModel = require('../models/userModel');

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
    userModel.getUserByEmail(email)
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
        password: userModel.createHashPassword(password),
    };

    // 用户信息写入数据库
    userModel.create(user)
        .then(function(user) {
            console.log('注册成功');
            // 将用户信息存入 session
            delete user.password;
            req.session.user = user;
            return res.json({
                'status': true,
                'email': email
            });
        }).catch(function(err) {
            console.log("create user fail");
        });
};

// Sign in
exports.signin = function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    userModel.getUserByEmail(email)
        .then(function(user) {
            try {
                if (!user) {
                    throw new Error('用户不存在');
                }
                if (!userModel.validHashPassword(password, user.password)) {
                    throw new Error('邮箱或密码错误');
                }
            } catch (e) {
                return res.json({
                    'status': false,
                    'message': e.message
                });
            }
            console.log(user.name+'已登陆');
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
    userModel.getUsers()
        .then(users => {
            console.log("users: \n");
            console.log(users);
            res.json(users);
        });
};

exports.myprofile = function(req, res, next) {
    if (!!req.session.user) {
        userModel.getUserByEmail(req.session.user.email)
            .then(user => {
                res.json({
                    'name': user.name,
                    'avatar': user.avatar,
                    'email': user.email,
                    'description': user.description,
                });
            });
    }
};

exports.browse.user = function(req, res, next) {
    userModel.getUserByEmail(req.params.userEmail)
        .then(user => {
            res.json({
                'name': user.name,
                'avatar': user.avatar,
                'email': user.email,
                'description': user.description,
            });
        });
};

exports.settings = function(req, res, next) {
    if (!!req.session.user) {
        userModel.getUserByEmail(req.session.user.email)
            .then(user => {
                res.json({
                    'name': user.name,
                    'avatar': user.avatar,
                    'email': user.email,
                    'description': user.description,
                });
            });
    }
};

exports.checkSignin = function(req, res, next) {
    if (!!req.session.user) {
        userModel.getUserByEmail(req.session.user.email)
            .then(user => {
                console.log('avatar:' + user.avatar);
                res.json({
                    'signedin': true,
                    'userAvatar': user.avatar
                });
            });
    } else {
        return res.json({
            'signedin': false,
            'userAvatar': 'img/avatar.png'
        })
    };
};

// Update profile
exports.updateProfile = function(req, res, next) {
    console.log("req.body: \n");
    console.log(req.body);
    if (req.body.name) {
        userModel.update({
            email: req.session.user.email
        }, {
            name: req.body.name
        }, function(error) {});
    };
    if (req.body.email) {
        userModel.update({
            email: req.session.user.email
        }, {
            email: req.body.email
        }, function(error) {});
        userModel.getUserByEmail(req.body.email)
            .then(user => {
                req.session.user = user;
            });
    };
    if (req.body.description) {
        userModel.update({
            email: req.session.user.email
        }, {
            description: req.body.description
        }, function(error) {});
    };

    userModel.getUserByEmail(req.session.user.email)
        .then(user => {
            req.session.user = user;
        });
    next();
};

// Update avatar
exports.updateAvatar = function(req, res, next) {
    var relativeAddress = 'uploads/' + req.file.filename;
    userModel.update({
        email: req.session.user.email
    }, {
        avatar: relativeAddress
    }, function(error) {
        console.log('updateAvatar error: ' + error);
    });
    next();
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
            tags: 'tags',
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

exports.getLeafFromDatabase = function(req, res, next) {

    var dataFromDatabase = {
        "filename": "fileOfPerdon",
        "author": "Perdon",
        "tree": [{
            "name": "作业汇总",
            "value": 0,
            "children": [
                {
                    "name": "高数homework",
                    "value": 1,
                    "children": [
                        {
                            "name": "第一章",
                            "value": 2,
                            "children": []
                        },
                        {
                            "name": "第二章",
                            "value": 3,
                            "children": []
                        },
                        {
                            "name": "第三章",
                            "value": 4,
                            "children": []
                        },
                        {
                            "name": "第四章",
                            "value": 5,
                            "children": []
                        },
                        {
                            "name": "第五章",
                            "value": 6,
                            "children": [
                                {
                                    "name": "第一节",
                                    "value": 7,
                                    "children": []
                                },
                                {
                                    "name": "第二节",
                                    "value": 8,
                                    "children": []
                                },
                                {
                                    "name": "第三节",
                                    "value": 9,
                                    "children": []
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "模电homework",
                    "value": 10,
                    "children": [
                        {
                            "name": "第一章",
                            "value": 11,
                            "children": []
                        },
                        {
                            "name": "第二章",
                            "value": 12,
                            "children": []
                        },
                        {
                            "name": "第三章",
                            "value": 13,
                            "children": []
                        }
                    ]
                },
                {
                    "name": "数字电子技术",
                    "value": 14,
                    "children": []
                },
                {
                    "name": "C++程序设计",
                    "value": 15,
                    "children": []
                },
                {
                    "name": "Web2.0",
                    "value": 16,
                    "children": [
                        {
                            "name": "Plan and Goals",
                            "value": 17,
                            "children": []
                        },
                        {
                            "name": "课程PPT",
                            "value": 18,
                            "children": []
                        },
                        {
                            "name": "课程作业",
                            "value": 19,
                            "children": [
                                {
                                    "name": "Homework1: Menu",
                                    "value": 20,
                                    "children": []
                                },
                                {
                                    "name": "Homework2: Login",
                                    "value": 21,
                                    "children": []
                                },
                                {
                                    "name": "Final Work: My Achievement",
                                    "value": 22,
                                    "children": []
                                }
                            ]
                        },
                        {
                            "name": "html",
                            "value": 23,
                            "children": []
                        },
                        {
                            "name": "css",
                            "value": 24,
                            "children": []
                        },
                        {
                            "name": "javascript",
                            "value": 25,
                            "children": []
                        }
                    ]
                },
                {
                    "name": "比赛经历",
                    "value": 26,
                    "children": [
                        {
                            "name": "软件创新大赛",
                            "value": 27,
                            "children": [
                                {
                                    "name": "总结与反思",
                                    "value": 28,
                                    "children": []
                                }
                            ]
                        },
                        {
                            "name": "美国数学建模大赛",
                            "value": 29,
                            "children": []
                        }
                    ]
                },
                {
                    "name": "总结与思考 homework",
                    "value": 30,
                    "children": []
                }
            ]
        }]
    };
    console.log("come to the server json successfully!");
    res.json(dataFromDatabase);
};

exports.saveLeafToDatabase = function(req, res, next) {
    console.log("out of the req");
    console.log(req.body.tree[0].children);
    userModel.update({
        "email": req.session.user.email
    }, {
        $push: {
            leaves: {
                "testName": req.body
            }
        }
    }, function(err, updatedData) {
        console.log(updatedData);
    });
    console.log(userModel.find(function(err, person) {
        console.log(person);
    }));
}
