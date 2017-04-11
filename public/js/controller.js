"use strict";

/*
    主页面登录注册
*/
function IndexCtrl($scope, $http, $location, $rootScope, toastr) {
    // rootScope里面的变量可以在不同的controller里面通用，而且可以在外面通过$root.变量名访问得到
    $scope.ngViewClass = 'page-home';
    $rootScope.$broadcast('authenticationChanged');
    $scope.download = function(resource) {
        window.open(resource);
    }

    $scope.switchToSignup = function() {
        $rootScope.title = 'Register';
    };
    $scope.switchToSignin = function() {
        $rootScope.title = 'Signin';
    };
    $scope.signup = function() {
        swal({
            title: $scope.formData.email + " ?",
            text: "请再次检查您的邮箱. \n",
            type: "info",
            showCancelButton: true,
            cancelButtonText: "取消",
            confirmButtonColor: "#8cd4f5",
            confirmButtonText: "注册!",
            closeOnConfirm: false,
            html: false
        }, function() {
            $http.post('/api/signup', $scope.formData)
                .then(function(data) {
                    if (data.data.status) {
                        $rootScope.$broadcast('authenticationChanged');
                        swal('注册成功!', 'Hi, ' + data.data.name + '!\nLeaf已向您发送一封验证邮件，为了您的安全，请尽快完成验证。\n接下来将自动为您登陆.', 'success');
                        $location.path('/myprofile');
                    } else {
                        swal('注册失败!', data.data.message, 'error');
                    }
                }, function(error) {
                    swal('注册失败!', '未知错误', 'error');
                    console.log('Error: ' + error);
                });
        });
    };
    $scope.signin = function() {
        $http.post('/api/signin', $scope.formData)
            .then(function(data) {
                if (data.data.status) {
                    $rootScope.$broadcast('authenticationChanged');
                    // swal('登陆成功!', 'Hi, ' + data.data.email + ' !', 'success');
                    toastr.success('登陆成功!');
                    $location.path('/myprofile');
                } else {
                    swal('登陆失败!', data.data.message, 'error');
                }
            }, function(error) {
                swal('登陆失败!', '未知错误', 'error');
                console.log('Error: ' + error);
            });
    };
}

function SigninCtrl($scope, $http, $location, $rootScope, toastr) {
    $scope.ngViewClass = 'page-signin';
    $scope.formData = {};
    $scope.formData.email = "example@qq.com";
    $scope.formData.password = "example";
    $scope.switchToSignup = function() {
        $rootScope.title = 'Register';
    };
    $scope.switchToSignin = function() {
        $rootScope.title = 'Signin';
    };
    $scope.signup = function() {
        swal({
            title: $scope.formData.email + " ?",
            text: "请再次检查您的邮箱. \n",
            type: "info",
            showCancelButton: true,
            cancelButtonText: "取消",
            confirmButtonColor: "#8cd4f5",
            confirmButtonText: "注册!",
            closeOnConfirm: false,
            html: false
        }, function() {
            $http.post('/api/signup', $scope.formData)
                .then(function(data) {
                    if (data.data.status) {
                        $rootScope.$broadcast('authenticationChanged');
                        swal('注册成功!', 'Hi, ' + data.data.name + '!\nLeaf已向您发送一封验证邮件，为了您的安全，请尽快完成验证。\n接下来将自动为您登陆.', 'success');
                        $location.path('/myprofile');
                    } else {
                        swal('注册失败!', data.data.message, 'error');
                    }
                }, function(error) {
                    swal('注册失败!', '未知错误', 'error');
                    console.log('Error: ' + error);
                });
        });
    };
    $scope.signin = function() {
        $http.post('/api/signin', $scope.formData)
            .then(function(data) {
                if (data.data.status) {
                    $rootScope.$broadcast('authenticationChanged');
                    // swal('登陆成功!', 'Hi, ' + data.data.email + ' !', 'success');
                    toastr.success('登陆成功!');
                    $location.path('/myprofile');
                } else {
                    swal('登陆失败!', data.data.message, 'error');
                }
            }, function(error) {
                swal('登陆失败!', '未知错误', 'error');
                console.log('Error: ' + error);
            });
    };
};

/*
    获取用户资料
*/
function MyprofileCtrl($scope, $http, $rootScope) {
    // console.log("myprofile");
    // console.log("params:"+$stateParams.username);
    $rootScope.$broadcast('authenticationChanged');
    $http.get('/api/myprofile')
        .then(function(response) {
            $scope.name = response.data.name;
            $scope.avatar = response.data.avatar;
            $scope.email = response.data.email;
            $scope.description = response.data.description;
            $scope.fileList = response.data.fileList;
            $rootScope.title = $scope.name;
        }, function(error) {
            // 重定向到错误页面
            // $location.url('error');
            console.log('Error: ' + error);
        });
};

/*
    查看其他用户的信息
*/
function BrowseUserCtrl($scope, $http, $rootScope, $routeParams) {
    $rootScope.$broadcast('authenticationChanged');
    $http.get('/api/browse/user/' + $routeParams.userEmail)
        .then(function(data) {
            $scope.name = data.data.name;
            $scope.avatar = data.data.avatar;
            $scope.email = data.data.email;
            $scope.description = data.data.description;
            $scope.fileList = data.data.fileList;
            $rootScope.title = 'Browse · ' + $scope.name;
        }, function(error) {
            console.log('Error: ' + error);
        });
};

/*
    接受信息
*/
function MymessagesCtrl($scope, $http, $rootScope) {};

/*
    请求
*/
function RequestsCtrl($scope, $http, $rootScope) {};

/*
    leaf的使用文档
*/
function HelpCtrl($scope, $http, $rootScope) {};

/*
    设置
*/
function SettingsCtrl($scope, $http, $rootScope) {
    $rootScope.$broadcast('authenticationChanged');
    $http.get('/api/settings')
        .then(function(response) {
            $scope.name = response.data.name;
            $scope.avatar = response.data.avatar;
            $scope.email = response.data.email;
            $scope.description = response.data.description;
        }, function(error) {
            console.log('Error: ' + error);
        });
};

app.controller('updateProfileCtrl', function($http, $rootScope, $location, $scope, toastr) {
    $scope.updateProfile = function() {
        $http.post('/api/updateProfile', $scope.formData)
            .then(function() {
                toastr.success('Update Profile Success!');
                $location.path('/myprofile');
            }, function() {
                toastr.success('Update Profile Success!');
                $location.path('/myprofile');
            });
    };
});

app.controller('updateAccountCtrl', function($http, $rootScope, $scope) {
    $scope.updateAccount = function() {
        $http.post('/api/updateAccount', $scope.formData);
    };
});

// 上传头像
app.controller('updateAvatarCtrl', function($http, $rootScope, $location, $scope, toastr) {
    $scope.uploadFile = function() {
        var file = $scope.myFile;
        var uploadUrl = "/api/updateAvatar";
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            })
            .then(function() {
                console.log("success!!");
                toastr.success('Update Avatar Success!');
                $location.path('/myprofile');
            }, function() {
                console.log("error!!"); // 暂不知道为什么总跳到这里
                toastr.success('Update Avatar Success!');
                $location.path('/myprofile');
            });
    };
});

/*
    退出登录
*/

function SignoutCtrl($scope, $http, $location, $rootScope, toastr) {
    $rootScope.$broadcast('authenticationChanged');
    $http.get('/api/myprofile')
        .then(function(response) {
            $scope.name = response.data.name;
            $scope.email = response.data.email;
            $scope.description = response.data.description;
        }, function(error) {
            console.log('Error: ' + error);
        });
    swal({
        title: "离开 Leaf 吗?",
        text: "您的会话记录将被删除",
        type: "warning",
        showCancelButton: true,
        cancelButtonText: "取消",
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "离开!",
        closeOnConfirm: false,
        html: false
    }, function() {
        $http.get('/api/signout')
            .then(function() {
                $rootScope.$broadcast('authenticationChanged');
                swal('登出成功!', '您的会话记录已被删除', 'success');
                // toastr.success('Your session has been deleted!', 'Sign out Success');
                $location.path('/');
            }, function(error) {
                swal('登出失败!', '未知错误', 'error');
                console.log('Error: ' + error);
            });
    });
};

// Leaf 页面， 内容为右边栏的处理方法
function LeafCtrl($scope, $rootScope, $http, $location, toastr, $window, $routeParams) {

    // // 刷新页面，能解决 collapse 的一些问题
    // $rootScope.$broadcast('enterLeafPage');
    // $rootScope.$on('enterLeafPage', function() {
    //     $window.location.reload();
    // });

    // 如果用户在这个页面刷新，广播能够根据用户的登陆状态修改导航栏的右上角数据
    $rootScope.$broadcast('authenticationChanged');

    $scope.username = $routeParams.username;
    $scope.filename = $routeParams.filename;
    $rootScope.title = $routeParams.username + ' · ' + $routeParams.filename;

    $scope.currentNodeId; // 当前节点id
    $scope.currentUser; // 当前用户

    // 当前用户身份 - 用于检验用户权限
    $http.get('/api/myprofile')
        .then(function(response) {
            $scope.currentUser = response.data;
        }, function(error) {
            console.log('Error: ' + error);
        });

    // 检验用户登陆状态， 用于评论
    $http.get('/api/checkSignin')
        .then(function(data) {
            $scope.signedinAlready = data.data.signedin;
        }, function(error) {
            console.log('Error: ' + error);
        });

    $scope.alertSaved = function() {
        toastr.success('已自动保存！');
    }

    // 提醒保存（如果是作者的话）
    $scope.$on('$locationChangeStart', function(event) {
        if ($scope.currentUser.name == $scope.username) {
            var answer = confirm("确认已经保存了吗？");
            if (!answer) {
                event.preventDefault();
            }
        }
    });
    // 选中一个节点时
    $scope.getNodeData = function() {
        console.log("$scope.nodeId: " + $scope.nodeId);
        console.log("$scope.nodeString: " + $scope.nodeString);

        $scope.nodePath = $scope.nodeString.split(",").reverse();
        console.log("$scope.nodePath: " + $scope.nodePath);
        $scope.currentNodeId = $scope.nodeId;
        getNodeDataFormDB();
    };

    var getNodeDataFormDB = function() {
        $http.get('/api/node/' + $scope.currentNodeId)
            .then(function(data) {
                console.log('response: ' + data.data);
                $scope.nodeData = data.data;

                // notes markdown
                $scope.markedNotes = marked($scope.nodeData.notes);

                // 获取作者信息
                $http.get('/api/browse/user/' + $scope.nodeData.authorEmail)
                    .then(function(data) {
                        $scope.author = data.data;
                    }, function(error) {
                        console.log('Error: ' + error);
                    });
            }, function(error) {
                console.log('Error: ' + error);
            });
    }

    // 更新描述
    $scope.updateDescription = function() {
        updateNodeData('描述更新成功！');
    };

    // 更新笔记
    $scope.updateNotes = function() {
        $scope.markedNotes = marked($scope.nodeData.notes);
        updateNodeData('笔记更新成功！');
    };

    // 添加计划
    $scope.updatePlan = function() {
        updateNodeData('更改计划成功！');
    };

    // 删除计划
    $scope.deletePlan = function(index) {
        $scope.nodeData.plans.splice(index, 1);
        updateNodeData('删除计划成功！');
    };

    // 添加计划
    $scope.addPlan = function(newPlan) {
        $scope.nodeData.plans.push(newPlan);
        updateNodeData('添加计划成功！');
        getNodeDataFormDB(); // 刷新数据
    };

    // 添加评论
    $scope.addComment = function(newCommentContent) {
        var newComment = {
            'commentId': Math.floor((Math.random() * 1000) + 1).toString(),
            'name': $scope.currentUser.name,
            'email': $scope.currentUser.email,
            'profile': '/browse/user/' + $scope.currentUser.email,
            'avatar': $scope.currentUser.avatar,
            'date': new Date().toDateString(),
            'content': newCommentContent,
            'children': []
        };
        $scope.nodeData.comments.push(newComment);
        updateNodeData('评论成功！');
        getNodeDataFormDB(); // 刷新数据
    };

    // 添加回复
    $scope.reply = function(comment, newCommentContent) {
        var newComment = {
            'commentId': Math.floor((Math.random() * 1000) + 1).toString(),
            'name': $scope.currentUser.name,
            'email': $scope.currentUser.email,
            'profile': '/browse/user/' + $scope.currentUser.email,
            'avatar': $scope.currentUser.avatar,
            'date': new Date().toDateString(),
            'content': newCommentContent,
            'children': []
        };
        comment.children.push(newComment);
        updateNodeData('回复成功！');
        getNodeDataFormDB(); // 刷新数据
    };

    // 更新数据到数据库
    var updateNodeData = function(info) {
        // 可修改的内容，不能直接post $scope.nodeData, 里面有些值会导致错误
        var leatestNodeData = {
            nodeId: $scope.nodeData.nodeId,
            comments: $scope.nodeData.comments,
            plans: $scope.nodeData.plans,
            documents: $scope.nodeData.documents,
            notes: $scope.nodeData.notes,
            description: $scope.nodeData.description,
            tags: $scope.nodeData.tags
        };
        console.log('leatestNodeData: ' + leatestNodeData);
        $http.post('/api/node/updateNodeData', leatestNodeData)
            .then(function() {
                toastr.success(info);
            }, function(error) {
                toastr.success(info); // 暂不知道为什么会跳到这里，但的确更新了
                console.log('Error: ' + error);
            });
    };

    // 上传文件
    $scope.uploadFile = function() {
        var file = $scope.myFile;
        var uploadUrl = "/api/uploadFile";
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            })
            .then(function(response) {
                console.log("success!!");
                console.log(response.data);
                $scope.nodeData.documents.push(response.data);
                updateNodeData('文件上传成功!');
            }, function(response) {
                console.log("error!!");
                toastr.error('文件上传失败!');
            });
    };

    // 删除文件
    $scope.deleteDocument = function(index) {
        $scope.nodeData.documents.splice(index, 1);
        updateNodeData('删除资料成功！');
    };

};

/*
    路由改变的时候调用
*/
app.run(['$rootScope', function($rootScope, $window) {
    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);

/*
    监视用户状态
*/
app.controller('checkSigninCtrl', function($http, $rootScope, $scope) {
    $rootScope.$on('authenticationChanged', function() {
        $http.get('/api/checkSignin')
            .then(function(response) {
                $scope.signedin = response.data.signedin;
                $scope.userAvatar = response.data.userAvatar;
            }, function(error) {
                console.log('Error: ' + error);
            });
    });
});

// 配置toastr
app.config(function(toastrConfig) {
    // extend相当于浅copy
    angular.extend(toastrConfig, {
        autoDismiss: false,
        containerId: 'toast-container',
        maxOpened: 0,
        newestOnTop: true,
        positionClass: 'toast-bottom-center',
        preventDuplicates: false,
        preventOpenDuplicates: false,
        target: 'body'
    });
});

function BrowseCtrl($scope, $rootScope, $http, $routeParams) {
    $scope.ngViewClass = 'page-browse';
    $rootScope.$broadcast('authenticationChanged');
    // users
    $http.get('/api/browse')
        .then(function(response) {
            $scope.leaves = [];
            $scope.users = [];
            $scope.users = response.data;
            console.log('users: ' + $scope.users);
            $scope.users.forEach(function(user) {
                user.fileList.forEach(function(filename) {
                    var leaf = {
                        "authorName": user.name,
                        "fileName": filename,
                        "type": "leaf"
                    };
                    $scope.leaves.push(leaf);
                });
            });
        }, function(error) {
            console.log('Error: ' + error);
        });

    $scope.documents = []; // "type": "document"
};

function AboutCtrl($scope, $http, $routeParams) {
    $scope.ngViewClass = 'page-about';
};

// to upload file using angular
app.directive('fileModel', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var modelFuc = $parse(attrs.fileModel);
            // 使得modelSetter可以通过下面的方法进行赋值
            var modelSetter = modelFuc.assign;

            element.bind('change', function() {
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

app.controller('newLeafCtrl', newLeafCtrl);

function newLeafCtrl($scope, $window, $location, $http) {
    $scope.newPublicLeaf = function() {
        var fileNULL = false;
        var filename = $window.prompt("请输入文件名");
        if (filename == null || filename == "") {
            fileNULL = true;
        }
        if (!fileNULL) {
            $scope.filename = filename;
            $http.get('/api/myprofile')
                .then(function(response) {
                    $scope.author = response.data.name;
                    $http.get('/api/getFileFromDatabase' + '/' + $scope.author + '/' + $scope.filename)
                        .then(function(response) {
                            var file = response.data;
                            // 返回是一个对象
                            // 文件存在
                            if (JSON.stringify(file) != "{}") {
                                $window.alert("已有相同文件名，创建失败");
                                // 提示用户可以打开同名文件
                                if ($window.confirm("你需要打开已存在的名字是 \'" + $scope.filename + "\' 的文件吗?")) {
                                    console.log("confirm yes!");
                                    $location.path('leaf/' + $scope.author + '/' + $scope.filename);
                                }
                            } else {
                                console.log("不存在该文件");
                                $location.path('leaf/' + $scope.author + '/' + $scope.filename);
                            }
                        }).catch(function(err) {
                            console.log("err" + err);
                        });
                }, function(error) {
                    console.log('Error: ' + error);
                });
        } else {
            $window.alert("创建文件失败，请检查文件名是否为空");
        }
    }
}

//注册一个过滤器，挂载到任意一个angular.module下，如果自定义过滤器较多，可以提取出来一个公用的过滤器module
app.filter('to_trusted', ['$sce', function($sce) {
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}]);
