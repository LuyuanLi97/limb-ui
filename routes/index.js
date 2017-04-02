var api = require('./api');

// multer
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads/');
        // var year = new Date().getFullYear();
        // var month = new Date().getMonth();
        // var date = new Date().getDate();
        // cb(null, './uploads/' + year.toString() + '/' + month.toString() + '/' + date.toString() + '/');
    },
    filename: function(req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null, file.originalname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});
var upload = multer({
    storage: storage
});

module.exports = function(app) {
    // app.post('/multer', upload.single('file'));
    // render
    app.get('/', function(req, res) {
        res.render('index');
    });
    app.get('/partials/:name', function(req, res) {
        var name = req.params.name;
        res.render('partials/' + name);
    });
    // 优化路由
    app.use(function(req, res, next) {
        console.log(req.path);
        if (req.path.indexOf('/api') >= 0) {
            next();
        } else if (req.path.length >= 2) {
            res.render('index');
            app.get(req.path);
            next();
        } else {
            next();
        }
    });

    // api
    app.post('/api/signup', api.signup);
    app.post('/api/signin', api.signin);
    app.post('/api/updateProfile', api.updateProfile);
    app.post('/api/updateAccount', api.updateAccount);
    app.post('/api/updateAvatar', upload.single('file'), api.updateAvatar);
    app.get('/api/signout', api.signout);
    app.get('/api/browse', api.browse);
    app.get('/api/myprofile', api.myprofile);
    app.get('/api/browse/user/:userEmail', api.browse.user);
    app.get('/api/settings', api.settings);
    app.get('/api/checkSignin', api.checkSignin);
    app.get('/api/getNodeData/:nodeId', api.getNodeData);
    app.get('test.json', function(req, res) {
        console.log("get('./test.json')");
    });


    // otherwise
    // app.get('*', function(req, res) {
    //     res.redirect('/');
    // });
}
