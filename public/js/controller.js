"use strict";

/*
    主页面登录注册
*/
function IndexCtrl($scope, $http, $location, $rootScope, toastr) {
    // rootScope里面的变量可以在不同的controller里面通用，而且可以在外面通过$root.变量名访问得到
    $rootScope.switchToSignup = function() {
        $scope.toSignup = true;
        $rootScope.title = 'Register';
    };

    $rootScope.switchToSignin = function() {
        $scope.toSignup = false;
        $rootScope.title = 'Signin';
    };

    $rootScope.signup = function() {
        swal({
            title: $scope.formData.email + " ?",
            text: "Please check your email againdasdsa \n",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#8cd4f5",
            confirmButtonText: "Yes, register!",
            closeOnConfirm: false,
            html: false,
        }, function() {  //  最后执行的回调函数
            // 现在路由归AngularJs接管，这里手动post数据
            $http.post('/api/signup', $scope.formData)
                .then(function(response) {
                    if (response.data.status) {
                        // 向子节点的controller传递值
                        $rootScope.$broadcast('authenticationChanged');
                        swal('注册成功!', 'Hi, ' + response.data.email + '!\nLeaf已向您发送一封验证邮件，为了您的安全，请尽快完成验证。\n接下来将自动为您登陆.', 'success');
                        // 类似重定向
                        $location.path('/myprofile');
                    } else {
                        swal('注册失败!', response.data.message, 'error');
                    }
                }, function(error) {
                    swal('注册失败!', '未知错误', 'error');
                    console.log('Error: ' + error);
                });
        });
    };

    $rootScope.signin = function() {
        $http.post('/api/signin', $scope.formData)
            .then(function(response) {
                if (response.data.status) {
                    $rootScope.$broadcast('authenticationChanged');
                    // swal('登陆成功!', 'Hi, ' + response.data.email + ' !', 'success');
                    toastr.success('Sign in Success!');
                    $location.path('/myprofile');
                } else {
                    swal('登录失败!', response.data.message, 'error');
                }
            }, function(error) {
                swal('登录失败!', '未知错误', 'error');
                console.log('Error: ' + error);
            });
    };

    $scope.signup = $rootScope.signup;
    $scope.signin = $rootScope.signin;
    $scope.switchToSignup = $rootScope.switchToSignup;
    $scope.switchToSignin = $rootScope.switchToSignin;
}

/*
    注册页面
*/
function SignupCtrl($scope, $http, $location, $rootScope, toastr) {
    $scope.switchToSignin = function() {
        $scope.toSignin = true;
        $rootScope.title = 'Signin';
    };
    $scope.switchToSignup = function() {
        $scope.toSignin = false;
        $rootScope.title = 'Register';
    };
    $scope.signup = $rootScope.signup;
    $scope.signin = $rootScope.signin;
};

/*
    登录页面
*/
function SigninCtrl($scope, $http, $location, $rootScope, toastr) {
    $scope.switchToSignup = function() {
        $scope.toSignup = true;
        $rootScope.title = 'Register';
    };
    $scope.switchToSignin = function() {
        $scope.toSignup = false;
        $rootScope.title = 'Signin';
    };
    $scope.signup = $rootScope.signup;
    $scope.signin = $rootScope.signin;
};

/*
    获取用户资料
*/
function MyprofileCtrl($scope, $http, $rootScope) {
    $rootScope.$broadcast('authenticationChanged');
    $http.get('/api/myprofile')
        .then(function(response) {
            $scope.name = response.data.name;
            $scope.email = response.data.email;
            $scope.description = response.data.description;
        }, function(error) {
            // 重定向到错误页面
            // $location.url('error');
            console.log('Error: ' + error);
        });
};

/*
    未知
*/
function BrowseUserCtrl($scope, $http, $rootScope, $routeParams) {
    $rootScope.$broadcast('authenticationChanged');
    $http.get('/api/browse/user/' + $routeParams.userName)
        .then(function(response) {
            $scope.name = response.data.name;
            $scope.email = response.data.email;
            $scope.description = response.data.description;
        }, function(error) {
            console.log('Error: ' + error);
        });
};

function MymessagesCtrl($scope, $http, $rootScope) {};

function RequestsCtrl($scope, $http, $rootScope) {};

function HelpCtrl($scope, $http, $rootScope) {};

function SettingsCtrl($scope, $http, $rootScope) {
    $rootScope.$broadcast('authenticationChanged');
    $http.get('/api/settings')
        .then(function(response) {
            $scope.name = response.data.name;
            $scope.email = response.data.email;
            $scope.description = response.data.description;
        }, function(error) {
            console.log('Error: ' + error);
        });
};

app.controller('updateProfileCtrl', function($http, $rootScope, $scope) {
    $scope.updateProfile = function() {
        console.log($scope.formData);
        $http.post('/api/updateProfile', $scope.formData)
            .then(function(data) {
                toastr.success('Update Profile Success!');
            });
    };
});

app.controller('updateAccountCtrl', function($http, $rootScope, $scope) {
    $scope.updateAccount = function() {
        $http.post('/api/updateAccount', $scope.formData);
    };
});

app.controller('updateAvatarCtrl', function($http, $rootScope, $scope) {
    $scope.updateAvatar = function() {
        $http.post('/api/updateAvatar', $scope.formData);
    };
});

function SignoutCtrl($scope, $http, $location, $rootScope, toastr) {
    $rootScope.$broadcast('authenticationChanged');
    $http.get('/api/myprofile')
        .then(function(data) {
            $scope.name = data.data.name;
            $scope.email = data.data.email;
            $scope.description = data.data.description;
        }, function(error) {
            console.log('Error: ' + error);
        });
    swal({
        title: "Leave Leaf?",
        text: "Your session will be deleted",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, leave!",
        closeOnConfirm: false,
        html: false
    }, function() {
        $http.get('/api/signout')
            .then(function() {
                $rootScope.$broadcast('authenticationChanged');
                swal('登出成功!', 'Your session has been deleted!', 'success');
                // toastr.success('Your session has been deleted!', 'Sign out Success');
                $location.path('/');
            }, function(error) {
                swal('登出失败!', '未知错误', 'error');
                console.log('Error: ' + error);
            });
    });
};

function LeafCtrl($scope, $http, $location) {
    $scope.description = "this is a description."
    $scope.notes = "Lato is free web-font designed by Lukasz Dziedzic from Warsaw. Here you can feel the color, size, line height and margins between paragraphs. Don’t forget to underline your links, they are an important visual marker for users."
};

app.run(['$rootScope', function($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);

app.controller('checkSigninCtrl', function($http, $rootScope, $scope) {
    $rootScope.$on('authenticationChanged', function() {
        $http.get('/api/checkSignin')
            .then(function(data) {
                $scope.signedin = data.data.signedin;
            }, function(error) {
                console.log('Error: ' + error);
            });
    });
});

// toastr config
app.config(function(toastrConfig) {
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

function BrowseCtrl($scope, $http, $routeParams) {
    // users
    $http.get('/api/browse')
        .then(function(data) {
            console.log(data.data);
            $scope.users = data.data;
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
