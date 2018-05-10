import express from 'express';
import updateOwner from '../../../models/update_owner'; // Import the Owner Model

import {
    error
} from 'util';

const router = express.Router();
var jwt = require('jsonwebtoken');
var Joi = require('joi');
var moment = require('moment');
var async = require('async');
var config = require('../../../../../config/config');
const bcrypt = require('bcrypt');

module.exports = {
    //register new owner
    register: (req, res, next) => {
        if (req.body) {
            let crypt_password = bcrypt.hashSync(req.body.password, config.salt);
            var data = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                contact: req.body.contact,
                email: req.body.email,
                password: crypt_password
            };
            var schema = Joi.object().keys({
                firstname: Joi.string().required(),
                lastname: Joi.string().required(),
                contact: Joi.string().required(),
                email: Joi.string().required(),
                password: Joi.string().required()

            });

            Joi.validate(data, schema, function (err, value) {
                if (err) {
                    res.json({
                        code: 201,
                        error: err,
                        message: "Validation errors!"
                    });
                } else {

                    updateOwner
                        .forge()
                        .save(data)
                        .then((users) => {
                            res.json({
                                code: 200,
                                status: true,
                                data: users.toJSON(),
                                message: 'new User created successfully!'
                            });
                        })
                        .catch((error) => {
                            res.json({
                                code: 400,
                                status: false,
                                data: error,
                                message: 'Error occured!'
                            });
                        })
                }
            });

        } else {
            res.json({
                code: 400,
                status: false,
                data: null,
                message: 'Missing Parameters!'
            });
        }
    },
    //Delete an owner with the Given ID
    deleteOwner: (req, res, next) => {
        if (req.params.id) {
            updateOwner
                .forge({
                    id: req.params.id
                })
                .fetch({
                    require: true
                })
                .then((owner) => {
                    owner
                        .destroy()
                        .then(() => {
                            res.json({
                                code: 200,
                                status: true,
                                message: 'Successfully deleted Owner!'
                            });
                        })
                })
                .catch((error) => {
                    res.json({
                        code: 400,
                        status: false,
                        data: null,
                        message: 'Error occured!'
                    });
                })
        } else {
            res.json({
                code: 400,
                status: false,
                data: null,
                message: 'Missing Parameters!'
            });
        }
    },
    //Get all Owner
    getOwners: (req, res, next) => {
        updateOwner
            .fetchAll()
            .then((owner) => {
                res.json({
                    code: 200,
                    status: true,
                    data: owner.toJSON(),
                    message: 'Owners fetch successfully!'
                });
            })
            .catch((error) => {
                res.json({
                    code: 400,
                    status: false,
                    data: error,
                    message: 'Error occured!'
                });
            });
    },


    login: (req, res, next) => {
        if (req.body) {
            let plain_pwd = req.body.password;
            var data = {
                email: req.body.email,
                password: req.body.password
            };
            var schema = Joi.object().keys({
                email: Joi.string().required(),
                password: Joi.string().required()

            });
            var expirationDuration = 60 * 60 * 8 * 1; // expiration duration 8 Hours 
            Joi.validate(data, schema, function (err, value) {
                if (err) {
                    res.json({
                        code: 201,
                        error: err,
                        message: "Validation errors!"
                    });
                } else {
                    updateOwner
                        .where({
                            email: req.body.email,
                            // password: req.body.password
                        })
                        .fetch()
                        .then((res_data) => {
                            // console.log(">>>>>>>>>", res_data.toJSON())
                            var usr = res_data.toJSON();
                            if (bcrypt.compareSync(plain_pwd, usr.password)) {
                                console.log("=======password matched success==========")
                                var tokenData = {
                                    "firstname": usr.firstname,
                                    "lastname": usr.lastname,
                                    "contact": usr.contact,
                                    "email": usr.email,
                                    "password": usr.password
                                };
                                var token = jwt.sign(tokenData, config.accessEncKey, {
                                    expiresIn: expirationDuration
                                });
                                var usrData = {
                                    'user': tokenData,
                                    'token': token
                                }
                                if (token) {
                                    updateOwner
                                        .where({
                                            email: req.body.email,
                                            // password: req.body.password
                                        })
                                        .save({
                                            token: token
                                        }, {
                                            patch: true
                                        })
                                        .then((res) => {
                                            console.log("token saved", res.toJSON())

                                        }).catch((err) => {
                                            console.log("token save failed", err)
                                        })
                                }
                                res.json({
                                    code: 200,
                                    status: true,
                                    data: usrData,
                                    message: 'login success!'
                                });
                            } else {
                                console.log("=======password NOT matched==========")
                                res.json({
                                    code: 401,
                                    status: false,
                                    data: usrData,
                                    message: 'Invalid password!'
                                });
                            }

                        })
                        .catch((error) => {
                            res.json({
                                code: 400,
                                status: false,
                                data: error,
                                message: 'login failed!'
                            });
                        });

                }
            });

        }
    },

}