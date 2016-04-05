"use strict";

var express = require('express');
var router = express.Router();
var request = require('superagent');
var _ = require('lodash');


/* GET parking places based on status (true or false) */
router.get('/', function (req, res, next) {
    var resource = req.app.get('host') + '/api/v1/parkings';
    var token = req.body.token || req.query.token || req.headers['access-token'];

    request.get(resource).query(req.query).set('access-token', token).end(function (err, result) {
        if (err) {
            res.status(500).send({
                success: false,
                message: 'Internal server error.'
            });
        }
        var vacant = '';
        if (req.query.vacant == 'true') {
            vacant = true;
        } else if (req.query.vacant == 'false') {
            vacant = false;
        }
        var filteredParkings = _.filter(result.body.data, {'vacant': vacant});
        sendResponse(res, filteredParkings);
    });
});


/* GET retrieve parking places based on position */
router.get('/position', function (req, res, next) {
    var resource = req.app.get('host') + '/api/v1/parkings';
    var token = req.body.token || req.query.token || req.headers['access-token'];
    var lat = req.query.latitude;
    var lon = req.query.longtitude;

    request.get(resource).query(req.query).set('access-token', token).end(function (err, result) {
        if (err) {
            res.status(500).send({
                success: false,
                message: 'Internal server error.'
            });
        }
        var filteredParkings = _.filter(result.body.data, {'position': {'latitude': lat, 'longtitude': lon}});
        sendResponse(res, filteredParkings);
    });
});


/* GET vacant parking places based on location */
router.get('/vacant-parkings', function (req, res, next) {
    var resource = req.app.get('host') + '/api/v1/search/position';
    var token = req.body.token || req.query.token || req.headers['access-token'];
    var lat = req.query.latitude;
    var lon = req.query.longtitude;

    request.get(resource).query(req.query).set('access-token', token).end(function (err, result) {
        if (err) {
            res.status(500).send({
                success: false,
                message: 'Internal server error.'
            });
        }
        var filteredParkings = _.filter(result.body.data, {
            'position': {'latitude': lat, 'longtitude': lon},
            'vacant': true
        });
        sendResponse(res, filteredParkings);
    });
});


/* POST method not supported */
router.post('/', function (req, res, next) {
    res.status(406).send({
        success: false,
        message: "Method not supported."
    });
});


/* PUT method not supported */
router.put('/', function (req, res, next) {
    res.status(406).send({
        success: false,
        message: "Method not supported."
    });
});


/* DELETE method not supported */
router.delete('/', function (req, res, next) {
    res.status(406).send({
        success: false,
        message: "Method not supported."
    });
});


/* Send response */
function sendResponse(res, filteredParkings) {
    if (filteredParkings.length < 1) {
        res.status(404).send({
            success: false,
            message: 'Not found.'
        });
    } else {
        res.json({
            success: true,
            message: 'Successful execution.',
            data: filteredParkings
        });
    }
}


module.exports = router;
