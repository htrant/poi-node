"use strict";

var express = require('express');
var router = express.Router();
var fs = require('fs');
var uuid = require('node-uuid');
var _ = require('lodash');
var datasource = './datasource/parkingplaces.json';


/* GET all */
router.get('/', function (req, res, next) {
    fs.readFile(datasource, 'utf8', function (err, data) {
        if (err) {
            res.status(500).send({
                success: false,
                message: 'Internal server error.'
            });
        }
        var parkings = JSON.parse(data);
        res.json({
            success: true,
            message: 'Successful execution.',
            data: parkings
        });
    });
});


/* GET based on id */
router.get('/:id', function (req, res, next) {
    var id = req.params.id;
    if (!id) {
        res.status(400).send({
            success: false,
            message: 'Bad request.'
        });
    }

    fs.readFile(datasource, 'utf8', function (err, data) {
        if (err) {
            res.status(500).send({
                success: false,
                message: 'Internal server error.'
            });
        }
        var parking = _.find(JSON.parse(data), {'id': id});
        if (!parking) {
            res.status(404).send({
                success: false,
                message: 'Not found.'
            });
        } else {
            res.json({
                success: true,
                message: 'Successful execution.',
                data: parking
            });
        }

    });
});


/* POST add new parking place */
router.post('/', function (req, res, next) {
    if (!req.body.hasOwnProperty("latitude") || !req.body.hasOwnProperty("longtitude") || !req.body.hasOwnProperty("floor") || !req.body.hasOwnProperty("slot")) {
        missingParamResponse(res);
    }
    var parking = {};
    parking.id = uuid.v1();
    parking.position = {
        latitude: req.body.latitude,
        longtitude: req.body.longtitude
    }
    parking.floor = req.body.floor;
    parking.slot = req.body.slot;
    if (req.body.hasOwnProperty("remark")) {
        parking.remark = req.body.remark;
    }
    parking.vacant = true;

    fs.readFile(datasource, 'utf8', function (err, data) {
        if (err) {
            res.status(500).send({
                success: false,
                message: 'Internal server error.'
            });
        }
        var parkings = JSON.parse(data);
        parkings.push(parking);
        fs.writeFile(datasource, JSON.stringify(parkings), 'utf8', function (err) {
            if (err) {
                res.status(500).send({
                    success: false,
                    message: 'Internal server error.'
                });
            } else {
                res.json({
                    success: true,
                    message: 'Successful execution.',
                    data: parking
                });
            }
        });
    });
});


/* PUT set vacancy of a parking place */
router.put('/:id', function (req, res, next) {
    var id = req.params.id;
    if (!id) {
        res.status(400).send({
            success: false,
            message: 'Bad request.'
        });
    }
    if (!req.body.hasOwnProperty("vacant")) {
        missingParamResponse(res);
    }

    fs.readFile(datasource, 'utf8', function (err, data) {
        if (err) {
            res.status(500).send({
                success: false,
                message: 'Internal server error.'
            });
        }

        // update vacancy status
        var parkings = JSON.parse(data);
        var index = _.findIndex(parkings, {'id': id});
        if (index == -1) {
            res.status(404).send({
                success: false,
                message: 'Not found.'
            });
        }
        parkings[index].vacant = req.body.vacant;

        // save
        fs.writeFile(datasource, JSON.stringify(parkings), 'utf8', function (err) {
            if (err) {
                res.status(500).send({
                    success: false,
                    message: 'Internal server error.'
                });
            } else {
                res.json({
                    success: true,
                    message: 'Successful execution',
                    data: parkings[index]
                });
            }
        });
    });
});


/* DELETE method not supported */
router.delete('/', function (req, res, next) {
    res.status(406).send({
        success: false,
        message: "Method not supported."
    });
});


function missingParamResponse(res) {
    res.status(400).send({
        success: false,
        message: 'Missing parameter(s).'
    });
}

module.exports = router;
