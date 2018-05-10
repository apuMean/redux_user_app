var jwt = require('jsonwebtoken');
var crypto = require('crypto');
// const otplib = require('otplib').default;
var config = require('./../config/config');
var async = require('async');
var fs = require('fs');
// var algorithm = 'aes-256-ctr';
var utils = require('./common');

module.exports = {

    ensureAuthorized: function (req, res, next) {
        var self = this;
        var bearerToken;
        var bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== 'undefined') {
            if (bearerHeader.split(' ')[0] == 'bearer') {
                bearerToken = bearerHeader.replace('bearer ', '');
                req.token = bearerToken;

                jwt.verify(bearerToken, config.accessEncKey, function (err, decoded) {
                    if (err) {
                        return res.send({
                            code: 401,
                            message: 'Invalid Token!'
                        });
                    } else {
                        req.user = decoded;
                        next();
                    }
                });
            } else {
                return res.send({
                    code: 401,
                    message: 'Invalid Token!'
                });
            }
        } else {
            return res.send({
                code: 401,
                message: 'Token not found!'
            });
        }
    },

    ensureAccess: function (req, res, next) {
        next();
        //console.log(req.user);
        /*if(req.user.login_type == 'app'){
            next();
        }else if(req.user.login_type == 'web'){
            var reqModule = req.url.split('/');
            //console.log('reqModule', reqModule)
            if(req.user.permissions.indexOf(reqModule[1]) >= 0){
                next();
            }else{
                __res.authError(res, 'You are not authorised to access this module!', [], 0);
            }
            next();
        }else{
            __res.authError(res, 'You are not authorised', [], 0);
        }*/
    },

    generatePassword: function (myPlaintextPassword, callback) {
        var salt = crypto.randomBytes(64).toString('base64');
        var passwordHash = myPlaintextPassword + salt;
        var cipher = crypto.createCipher(algorithm, config.accessEncKey)
        var crypted = cipher.update(passwordHash, 'utf8', 'hex')
        var cryptedPassword = crypted + cipher.final('hex');
        callback(null, salt, cryptedPassword);
    },

    comparePassword: function (pData, password, solt, callback) {
        var decipher = crypto.createDecipher(algorithm, config.accessEncKey);
        var dec = decipher.update(pData, 'hex', 'utf8');
        dec += decipher.final('utf8');
        var pass = dec.replace(solt, '');
        //console.log(password,pass,solt)
        if (pass == password) {
            return callback(true);
        } else {
            return callback(false);
        }
    },

    generateOtp: function (callback) {
        otplib.authenticator.options = {
            step: 240
        }
        var secret = otplib.authenticator.generateSecret();
        var otp = otplib.authenticator.generate(secret);
        callback(secret, otp);
    },

    compareOtp: function (secret, otp, callback) {
        callback(otplib.authenticator.verify({
            secret,
            token: otp
        }));
    }
};