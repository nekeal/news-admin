var express = require("express");
var crypto = require('crypto');
var path = require('path');
var app = express();
var session = require('express-session');
var bodyParser = require("body-parser");
var cookie = require("cookie-parser");
var router = express.Router();
var mongoose = require("mongoose");
var morgan = require("morgan");
var bcrypt = require('bcrypt');
var login = require('./external/login');
var basicAuth = require('basic-auth');
var mongoOp = require("./models/news");
var Users0p = require("./models/users");
var Tokens0p = require("./models/tokens");
var MemoryStore = session.MemoryStore;
var sessionStore = new MemoryStore();
mongoose.connect('mongodb://localhost:27017/comApp');
const saltRounds = 10;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ "extended": false }));
app.use(session({
    secret: 'ssshhhhh',
    store: sessionStore
}));
app.use(cookie());
app.use(morgan('dev'));
router.get("/", function (req, res) {
    res.json({ "error": false, "message": "Hello World" });
});

router.route("/news")
    .get(function (req, res) {
        var response = {};
        mongoOp.find({}, function (err, data) {
            // Mongo command to fetch all data from collection.
            if (err) {
                response = { "error": true, "message": "Error fetching data" };
                console.log("fail");
            } else {
                response = { "error": false, "message": data };
                console.log("connected");
                console.log(data);
            }
            res.json(response);
        });
    })
    .post(function (req, res) {
        var db = new mongoOp();
        var response = {};
        // fetch email and password from REST request.
        // Add strict validation when you use this in Production.
        db.title = req.body.title;
        db.content = req.body.content;
        db.status = req.body.status;
        db.save(function (err) {
            // save() will run insert() command of MongoDB.
            // it will add new data in collection.
            if (err) {
                response = { "error": true, "message": "Error adding data" };
            } else {
                response = { "error": false, "message": "Data added" };
            }
            res.json(response);
        });
    })

    .put(function (req, res) {
        response = {};
        mongoOp.findById(req.params.id, function (err, data) {

            if (err) {
                response = { "error": true, "message": "Error fetching data" };
            }
            else {
                if (req.body.title !== undefined)
                    data.title = req.body.title;
                if (req.body.content !== undefined)
                    data.content = req.body.content;
                if (req.body.status !== undefined)
                    data.status = req.body.status;
                data.save(function (err) {
                    if (err)
                        response = { "error": true, "message": "Error saving data" };
                    else
                        response = { "error": true, "message": "Data saved succesfully for id " + req.body.id };
                });
            }
        });
        res.json(response)

    });
router.route("/news/:name/:value")
    .get(function (req, res) {
        var response = {};
        mongoOp.find({ [req.params.name]: req.params.value }, function (err, data) {
            // This will run Mongo Query to fetch data based on ID.
            if (err) {
                response = { "error": true, "message": "Error fetching data" };
            } else {
                response = { "error": false, "message": data };
            }
            console.log()
            res.json(response);
        });
    });
router.route('/news/:id')
    .delete(function (req, res) {
        var response = {};
        var news;
        mongoOp.findById(req.params.id, function (err, data) { if (err) { } else { news = data } });
        console.log("news " + news.title);
        mongoOp.remove({ _id: req.params.id }, function (err) {
            if (err) {
                response = { "error": true, "message": "Error deleting news" };
            }
            else {
                response = { "error": false, "message": "Data saved succesfully for title " + data };
            }
            res.json(response);
        });
    });
//router.route('/login')
//
///
router.get('/management', login.check, function (req, res) {
    res.sendFile(__dirname + "/html/admin.html");
    console.log(req.session);
    console.log(req.session.auth);
});
router.route('/register')
    .post(function (req, res) {
        var db = new Users0p();
        var has;
        db.user = req.body.user;
        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {

            db.password = hash;
            db.save(function (err) {
                if (err)
                    response = { "error": true, "message": "Error adding User" };
                else
                    response = { "error": false, "message": "User " + req.body.user + " registered succesfully" };
                res.json(response);
            });
        });
    });
//  router.get('/loginn',function(req,res){console.log(req.session.auth);})
router.route('/login')
    .get(function (req, res) {
        res.sendFile(__dirname + '/html/login.html');
    })
    .post(function (req, res) {
        var user = basicAuth(req);
        console.log(user);
        var response = { message: "before" };
        Users0p.findOne({ user: user.name }, function (err, data) { 

            if (err) {
                response = { error: true, "message": "internal server error" };
                console.log(err);
            }
            else if (data === null)
                response = { error: true, "message": "User not found" };
            else {
                var passMatch = bcrypt.compareSync(user.pass, data.password);
                if (!passMatch)

                    response = { error: true, "message": "Password does not match" };

                else {
                    response = { "error": false, "message": "User successfully loggeed in" };
                    req.session.auth = user.name + crypto.randomBytes(5).toString('hex');
                }
            }
            res.send(response);
        });
    });
router.get('/logout', function (req, res) {

    res.redirect("/api/login");
    req.session.destroy();
});
router.get('/test', function (req, res) {
    if (req.session.i)
        req.session.i++;
    else
        req.session.i = 1;
    if (req.session.i == 11111) req.session.destroy()
    res.send(req.cookies);
});


app.use('/api', router);
app.use('/html', express.static(path.join(__dirname + '/html')));
app.use('/js', express.static(path.join(__dirname + '/js')));
app.use('/css', express.static(path.join(__dirname + '/css')));
app.use('/svg', express.static(path.join(__dirname + '/svg')));

app.listen(3000);
console.log("Listening to PORT 3000");