"use strict";

/*
    主页面登录注册
*/
function IndexCtrl($scope, $http, $location, $rootScope, toastr) {
    // rootScope里面的变量可以在不同的controller里面通用，而且可以在外面通过$root.变量名访问得到
    $scope.ngViewClass = 'page-home';
    $rootScope.$broadcast('authenticationChanged');
}

function SigninCtrl($scope, $http, $location, $rootScope, toastr) {
    $scope.ngViewClass = 'page-signin';
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
            $scope.description = data.data.description;
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

function LeafCtrl($scope, $rootScope, $http, $location) {
    $rootScope.$broadcast('authenticationChanged');
    // 几组 node id
    $scope.nodes = ['root', 'web2.0', '课程作业', '模电homework'];

    // 默认读取跟节点数据
    $http.get('/api/getNodeData/root')
        .then(function(response) {
            $scope.nodeData = response.data;
        });

    // 选中其他节点时
    $scope.getNodeData = function(nodeId) {
        $http.get('/api/getNodeData/' + nodeId)
            .then(function(response) {
                $scope.nodeData = response.data;
            });
    }
};

/*
    路由改变的时候调用
*/
app.run(['$rootScope', function($rootScope) {
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
            $scope.users = response.data;
        }, function(error) {
            console.log('Error: ' + error);
        });

    $scope.leaves = [{
        topic: "web",
        type: "leaf"
    }, {
        topic: "angularJS",
        type: "leaf local"
    }];

    $scope.documents = [{
        documentName: "Operating System week2.pdf",
        type: "document local"
    }, {
        documentName: "News English week3.pdf",
        type: "document"
    }];
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

function new_functionCtrl($scope, $http, $location, $routeParams) {}
