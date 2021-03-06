var express = require('express');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var bcrypt = require("bcrypt-nodejs");
var router = express.Router();
var schema = require("./schema");

var Firebase = require("firebase");
var ref = new Firebase("https://salesworld.firebaseio.com/");

var usersModel = schema.usersModel;
var usersSchema = schema.usersSchema;

//var publicPath = path.resolve(__dirname, 'public');
//router.use(express.static(publicPath));


/*var listRef = new Firebase("https://salesworld.firebaseio.com/presence/");
 var userRef = listRef.push();

 // Add ourselves to presence list when online.
 var presenceRef = new Firebase("https://salesworld.firebaseio.com/.info/connected");
 presenceRef.on("value", function(snap) {
 if (snap.val()) {
 // Remove ourselves when we disconnect.
 userRef.onDisconnect().remove();

 userRef.set(true);
 }
 });*/


router.use(bodyParser.json());
router.use(bodyParser.urlencoded());
router.post('/signup', function (req, res) {
    ref.createUser({
        email: req.body.userName,
        password: req.body.password
    }, function (error, userData) {
        if (error) {
            res.send({status: 4, err: error});
        } else {
            req.body.firebaseToken = userData.uid;
            console.log(req.body);
            var user = new usersModel(req.body);
            user.save(function (err, success) {
                res.send(err || success);
            });
        }
    });
});
router.post('/login', function (req, res) {
    usersModel.findOne({roll: 1, userName: req.body.userName}, function (err, success) {
        if (success) {
            bcrypt.compare(req.body.password, success.password, function (err, isMatch) {
                done(err, isMatch);
            });
            function done(err2, isMatch) {
                isMatch ? res.send(success) : res.send(err);
            }
        }
        else {
            res.send(success)
        }
    });
});
router.post('/login-salesman', function (req, res) {
    usersModel.findOne({userName: req.body.userName}, function (err, success) {
        if (success) {
            bcrypt.compare(req.body.password, success.password, function (err, isMatch) {
                isMatch ? res.send(success) : res.send(err);
            });
        }
        else {
            res.send(success)
        }
    });
});

module.exports = router;
