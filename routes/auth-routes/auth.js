"use strict";

var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var _ = require('lodash');


var users = [
    {
        username: "userone",
        password: "password"
    },
    {
        username: "usertwo",
        password: "password"
    }
];


/* GET method unsupport */
router.get('/', function (req, res, next) {
    res.json({
        success: false,
        message: 'Method is not supported'
    });
});


/* POST home page. */
router.post('/', function (req, res, next) {
    var user = _.find(users, {"username": req.body.username});
    if (!user) {
        res.json({
            success: false,
            message: 'Authentication failed. User not found.'
        });
    }

    if (user.password != req.body.password) {
        res.json({
            success: false,
            message: 'Authentication failed. Wrong password.'
        });
    }

    var token = jwt.sign(user, 'pointofinterest', {
        expiresIn: 86400
    });
    res.json({
        success: true,
        message: 'Authentication successful.',
        token: token
    });
});


/* PUT method unsupport */
router.put('/', function (req, res, next) {
    res.json({
        success: false,
        message: 'Method is not supported'
    });
});


/* DELETE method unsupport */
router.delete('/', function (req, res, next) {
    res.json({
        success: false,
        message: 'Method is not supported'
    });
});

module.exports = router;
