var api = require('./api');

module.exports = function(app) {
    // render
    app.get('/', function(req, res, next) {
        res.render('index');
    });

    // :后面作为一个可变的参数传进去，由req进行访问
    app.get('/partials/:name', function(req, res, next) {
        var name = req.params.name;
        console.log("partials:"+name+"has been request!");
        res.render('partials/' + name);
        console.log("par");
    });

    // 解决直接访问路由出现404错误的问题
    app.use(function(req, res, next) {
        console.log("req.path:");
        console.log(req.path);
        // 路由中含有api
        if (req.path.indexOf('/api') >= 0) {
            next();
        } else if (req.path.length >= 2) {
            res.render('index');
            app.get(req.path);
            // next();
        } else {
            // next();
        }
    });

    // api
    app.post('/api/signup', api.signup);
    app.post('/api/signin', api.signin);
    app.post('/api/updateProfile', api.updateProfile);
    app.post('/api/updateAccount', api.updateAccount);
    app.post('/api/updateAvatar', api.updateAvatar);
    app.get('/api/signout', api.signout);
    app.get('/api/browse', api.browse);
    app.get('/api/myprofile', api.myprofile);
    app.get('/api/browse/user/:userName', api.browse.user);
    app.get('/api/settings', api.settings);
    app.get('/api/checkSignin', api.checkSignin);
    // app.get('test.json', function(req, res) {
    //     console.log("get('./test.json')");
    // })

    // otherwise
    // app.get('*', function(req, res) {
    //     res.redirect('/');
    // });
}
