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
    app.get('/', function(req, res, next) {
        res.render('index');
    });

    // :后面作为一个可变的参数传进去，由req进行访问
    app.get('/partials/:name', function(req, res, next) {
        var name = req.params.name;
        console.log("partials:" + name + "has been request!");
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
            // 托管给angular
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
    app.post('/api/saveFileToDatabase/:filename', api.saveFileToDatabase);
    app.post('/api/cloneFile', api.cloneFile);
    app.post('/api/starFile', api.starFile);
    app.post('/api/deleteFile', api.deleteFile);
    // app.post('/api/changeFilename', api.changeFilename);
    app.get('/api/isFileNew/:author/:filename', api.isFileNew);
    app.get('/api/getFileFromDatabase/:author/:filename', api.getFileFromDatabase);
    // app.get('/api/getUsernameAndFilename', api.getUsernameAndFilename);
    app.get('/api/signout', api.signout);
    app.get('/api/browse', api.browse);
    app.get('/api/myprofile', api.myprofile);
    app.get('/api/browse/user/:userEmail', api.browse.user);
    app.get('/api/settings', api.settings);
    app.get('/api/checkSignin', api.checkSignin);
    // app.get('/api/getNodeData/:nodeId', api.getNodeData);
    app.get('/api/create.json', api.getCreateJson);


    app.get('/api/node/:nodeId', api.node);
    app.post('/api/node/updateNodeData', api.node.updateNodeData);

    app.post('/api/uploadFile', upload.single('file'), api.uploadFile);


    // otherwise
    // app.get('*', function(req, res) {
    //     res.redirect('/');
    // });
}
