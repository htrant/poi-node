"use strict";

var express = require('express');
var router = express.Router();
var fs = require('fs');
var jwt = require('jsonwebtoken');


/** middleware route to protect api */
router.use(function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['access-token'];
    if (token) {
        jwt.verify(token, 'pointofinterest', function (err, decoded) {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Invalid token.'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token sent.'
        });
    }
});

module.exports = router;
