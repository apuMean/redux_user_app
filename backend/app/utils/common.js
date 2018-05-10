var config = require('./../config/config');
var async = require('async');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');

module.exports = {
    isExists: function (data, key) {
        if (this.notEmpty(data)) {
            if (this.notEmpty(data[key])) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    notEmpty: function (data) {
        var res = true;
        var dataType = typeof data;
        switch (dataType) {
            case 'object':
            case 'array':
                if (data == null || data.length < 1)
                    res = false;
                break;

            case 'undefined':
                res = false;
                break;

            case 'number':
                if (data == "")
                    res = false;
                break;
            case 'string':
                if (data.trim() == "")
                    res = false;
                break;
        }
        return res;
    },
    remove_empty: function (data) {
        var y;
        for (var x in data) {
            y = data[x];
            if (y === "null" || y === null || y === "" || typeof y === "undefined" || (y instanceof Object && Object.keys(y).length == 0)) {
                delete data[x];
            }
            if (y instanceof Object)
                y = this.remove_empty(y);
        }
        return data;
    },
    shuffle: function (array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    },
    rollback: function (docs, rollbackCallback) {
        if (!docs) {
            rollbackCallback();
        } else {
            async.eachOfSeries(docs, function (doc, key, cb) {
                if (doc.rb_status) {
                    doc.model.findByIdAndRemove(doc.data._id, function (err, doc) {
                        console.log("\x1b[31m", 'Rolled-back document: ' + doc);
                        cb();
                    });
                } else {
                    cb();
                }
            }, function (err) {
                if (err) {
                    console.error(err.message);
                }
                rollbackCallback();
            });
        }
    },
    user_unique_check: function (models, field, value, prps, _id, user_type, clinic_id, callback) {
        var query = {
            status: { $ne: config.recordStatus.delete },

        };
        query[field] = value;

        if (user_type != 'clinic') {
            query['$or'] = [
                { 'parent_data._id': models.mongoose.Types.ObjectId(clinic_id) },
                { 'parent_data.parent': models.mongoose.Types.ObjectId(clinic_id) }
            ];
        }

        if (prps != 'create') {
            query._id = { $ne: models.mongoose.Types.ObjectId(_id) };
        }

        models.user.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "parent",
                    foreignField: "_id",
                    as: "parent_data"
                }
            },
            { $unwind: { path: "$parent_data", preserveNullAndEmptyArrays: true } },
            { $match: query },
        ]).exec(function (err, retData) {
            if (err) {
                callback(false);
            } else {
                if (retData.length <= 0) {
                    callback(false);
                } else {
                    callback(true);
                }
            }
        });
    },
    unique_check: function (model, field, value, prps, _id, callback) {
        var query = { status: 1 };
        query[field] = value;
        if (prps != 'create') {
            query._id = { $ne: _id };
        }

        model.find(query).exec(function (err, retData) {
            if (err) {
                callback(false);
            } else {
                if (retData.length <= 0) {
                    callback(false);
                } else {
                    callback(true);
                }
            }
        });
    },
    sendMail: function (to, template, replacement, callback) {
        var models = __rootRequire('app/api/v1/models');
        var email = __rootRequire('app/core/email');
        models.emailtemplate.findOne({ code: template })
            .exec(function (err, retData) {
                if (err) {
                    callback(error);
                } else {
                    var options = {
                        body: retData.content,
                        repalcement: replacement,
                        to: to,
                        subject: retData.subject
                    };
                    email.smtp.sendMail(options, function (error, response) {
                        if (error) {
                            console.log(error);
                            callback(error);
                        } else {
                            console.log("mail sent succesfull");
                            callback(null);
                        }
                    });
                }
            });
    },
    sendSMS: function (toPhone, message, callback) {
        var AWS = require('aws-sdk');
        AWS.config.update({
            accessKeyId: config.aws.accessKeyId,
            secretAccessKey: config.aws.secretAccessKey,
            region: config.aws.region
        });
        var sns = new AWS.SNS({
            apiVersion: '2017-08-28',
            region: config.aws.region
        });
        var params = {
            Message: message,
            PhoneNumber: toPhone.substr(1),
            //PhoneNumber: '919734438295',
            //Subject: message
        };
        sns.publish(params, function (err, data) {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                //console.log("sms sent successful to "+toPhone, data);
                //console.log(data);
                callback(null);
            }
        });
    },
    createFolder: function (filderPath, callback) {
        mkdirp(filderPath, function (err) {
            if (err) {
                callback(err);
            } else {
                callback(null);
                console.log('dir created')
            }
        });
    },
    saveImage: function (base64Data, imgName, imgPath, callback) {
        var file = {};
        var timestamp = Number(new Date());
        var imageTypeRegularExpression = /\/(.*?)$/;
        var imagePath = path.resolve(imgPath);
        var $this = this;
        $this.createFolder(imagePath, function (err) {
            if (err) {
                console.log(err);
                callback({ msg: "folder not created!" }, null);
            } else {
                var imgurl = config.baseUrl + imgPath;
                var imageBuffer = $this.decodeBase64Image(base64Data);

                if (imageBuffer == "err") {
                    callback({ msg: "Invalid image!" }, null);
                } else {
                    var imageTypeDetected = imageBuffer.type.match(imageTypeRegularExpression);
                    var fileName = imgName ? (imgName + '_' + timestamp + '.' + imageTypeDetected[1]) : (timestamp + '.' + imageTypeDetected[1]);
                    var userUploadedImagePath = imagePath + '/' + fileName;
                    var userUploadedImagePathDb = fileName + '.' + imageTypeDetected[1];
                    file.path = userUploadedImagePath,
                        file.name = fileName + '.' + imageTypeDetected[1],
                        file.type = imageTypeDetected.input,
                        file.hash = null,
                        file._writeStream = {
                            _writableState: {
                                highWaterMark: '',
                                objectMode: false,
                                needDrain: false,
                                ending: true,
                                ended: true,
                                finished: true,
                                decodeStrings: true,
                                defaultEncoding: 'utf8',
                                length: 0,
                                writing: false,
                                sync: false,
                                bufferProcessing: false,
                                onwrite: [Function],
                                writecb: null,
                                writelen: 0,
                                buffer: [],
                                errorEmitted: false
                            },
                            writable: true,
                            domain: null,
                            _events: {},
                            _maxListeners: 10,
                            path: userUploadedImagePath,
                            fd: null,
                            flags: 'w',
                            mode: 438,
                            start: undefined,
                            pos: undefined,
                            closed: true
                        }

                    // Save decoded binary image to disk
                    fs.writeFile(userUploadedImagePath, imageBuffer.data, function (err) {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else {
                            callback(null, imgurl + fileName);
                        }
                    });

                }
            }
        });
    },
    decodeBase64Image: function (dataString) {
        var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        // var matches = dataString.match('^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$')
        var response = {};
        if (matches) {
            if (matches.length !== 3) {
                return "err";
            }
            response.type = matches[1];
            response.data = new Buffer(matches[2], 'base64');
            return response;
        } else {
            return "err";
        }
    },
    pushNotification: function (deviceData, msg, attach, cb) {
        //console.log(deviceData, msg, attach)
        dispMsg = msg.replace(/<[^>]+>/g, ' ').trim();
        dispMsg = (dispMsg.length > 45) ? dispMsg.substring(0, 45) + '...' : dispMsg;
        async.eachOfSeries(deviceData, function (data, key, clb) {
            if (data.deviceType == 'Android') {
                var FCM = require('fcm-node');
                var fcm = new FCM(config.androidPushKey);
                var message = {
                    to: data.token,
                    notification: {
                        title: 'OmniSeq Notification',
                        body: msg
                    },
                    data: attach
                };

                fcm.send(message, function (err, response) {
                    if (err) {
                        console.error('err', err);
                        clb()
                    } else {
                        console.log(config.androidPushKey, message, 'Push notification sent to' + data.token, response);
                        clb()
                    }
                });
            } else if (data.deviceType == 'iOS') {
                var apn = require("apn");
                var options = {
                    "cert": config.iosPushKey.certFile,
                    "key": config.iosPushKey.keyFile,
                    "passphrase": config.iosPushKey.passphrase,
                    "gateway": config.iosPushKey.gateway,
                    "port": config.iosPushKey.port,
                    "enhanced": config.iosPushKey.enhanced,
                    "cacheLength": config.iosPushKey.cacheLength
                };
                options.errorCallback = function (err) {
                    console.log("APN Error:", err);
                };
                var apnConnection = new apn.Connection(options);
                var myDevice = new apn.Device(data.token);
                var note = new apn.Notification();
                note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
                note.badge = 1;
                note.sound = "ping.aiff";
                note.alert = dispMsg;
                note.payload = { 'msg': msg, 'attachments': attach };

                if (apnConnection) {
                    apnConnection.pushNotification(note, myDevice);
                }
                clb();
            }
        }, function (err) {
            if (err) {
                console.error('err', err);
                cb(err, null)
            } else {
                //console.log('All completed');
                cb(null, true)
            }
        });
    },
    getDirectoryData: function (dirPath, cb) {
        var data = []
        fs.readdir(dirPath, function (err, items) {
            async.eachOf(items, (item, key, callback) => {
                fs.stat(path.join(dirPath, item), function (err, stats) {
                    if (!err) {
                        if (stats.isDirectory()) {
                            getDirectoryData(path.join(dirPath, item), (d) => {
                                data.push({
                                    name: item,
                                    type: 'Directory',
                                    path: config.baseUrl + dirPath + item,
                                    items: d
                                });
                                callback();
                            });
                        } else {
                            data.push({
                                name: item,
                                type: 'File',
                                path: config.baseUrl + dirPath + item
                            });
                            callback();
                        }

                    } else {
                        console.log(err);
                        callback();
                    }
                });
            }, (err) => {
                cb(data);
            });
        });
    },
    getDynamicData: function (req, res, next) {
        var settingsModels = __rootRequire('app/api/v1/models/settings.model');
        settingsModels.find().exec(function (err, retData) {
            if (err) {
                __res.error(res, 'Settings not found!', []);
            } else {
                async.eachOfSeries(retData, function (data, key, cb) {
                    if (!req.configuration[data.group_name]) {
                        req.configuration[data.group_name] = {};
                        req.configuration[data.group_name][data.field_name] = data.value;
                        cb();
                    } else {
                        req.configuration[data.group_name][data.field_name] = data.value;
                        cb();
                    }
                }, function (err) {
                    next();
                });
            }
        });
    }
};