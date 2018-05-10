var jwt = require('jsonwebtoken');
var Joi = require('joi');
var moment = require('moment');
var async = require('async');
const bcrypt = require('bcrypt');

var config = require('../../../../../config/config')
import updateUser from '../../../models/update_user';

// var crypto = __rootRequire('app/utils/crypto');
// var models = __rootRequire('app/api/v1/models');


module.exports = {
    //register new user in updateUser
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

                    updateUser
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

    //Get all Users from updateUser
    getUsers: (req, res, next) => {
        console.log(" inside getUsers")

        updateUser
            .fetchAll()
            .then((users) => {
                res.json({
                    code: 200,
                    status: true,
                    data: users.toJSON(),
                    message: 'Users fetch successfully!'
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
    getUserById:(req,res)=>{
        console.log("inside get user by id", req.query)
        if (req.query.id) {
            updateUser
                .forge({
                    id: req.query.id
                })
                .fetch({
                    require: true
                })
                .then((user) => {               
                            res.json({
                                code: 200,
                                status: true,
                                data:user.toJSON(),
                                message: 'Successfully fetched User!'
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
        } else {
            res.json({
                code: 400,
                status: false,
                data: null,
                message: 'User not found!'
            });
        }
    },
    editUser:(req,res)=>{
// console.log('req>>>',req.body)
        if (req.body) {
            var data = {
                id:req.body.id,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                contact: req.body.contact,
                email: req.body.email,
                password:req.body.password
            };
            updateUser
                        .where({id:data.id})
                        .save(data,{patch:true})
                        .then((users) => {
                            res.json({
                                code: 200,
                                status: true,
                                data: users.toJSON(),
                                message: 'user updated successfully!'
                            });
                        })
                        .catch((error) => {
                            console.log(error,"<<<<<<<<")
                            res.json({
                                code: 400,
                                status: false,
                                data: error,
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
    //Delete an Users with the Given ID
    deleteUser: (req, res, next) => {
        console.log("req",req.body)
        if (req.body.id) {
            updateUser
                .forge({
                    id: req.body.id
                })
                .fetch({
                    require: true
                })
                .then((user) => {
                    user
                        .destroy()
                        .then(() => {
                            res.json({
                                code: 200,
                                status: true,
                                message: 'Successfully deleted User!'
                            });
                        })
                })
                .catch((error) => {
                    res.json({
                        code: 400,
                        status: false,
                        data: error,
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
                    updateUser
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
                                    updateUser
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

    checklogin: function (req, res, next) {
        crypto.ensureAuthorized(req, res, function () {
            var rsData = {
                user: req.user
            }
            __res.success(res, 'You have a valid login details', rsData);
        });
    },

    adminLogin: function (req, res, next) {
        var data = {
            email: req.body.email.toLowerCase(),
            password: req.body.password
        };
        var schema = Joi.object().keys({
            email: Joi.string().required(),
            password: Joi.string().required()
        });
        Joi.validate(data, schema, function (err, value) {
            if (err) {
                __res.error(res, 'Validation errors!', err, [], 0);
            } else {
                models.user.find({
                    email: data.email,
                    role: 'SUPERADMIN'
                }, function (err, userInfo) {
                    if (err) {
                        __res.error(res, 'Something Went wrong!', err, [], 0);
                    } else {
                        if (userInfo) {
                            var userfound = null;
                            async.eachSeries(userInfo, function iteratee(user, callback) {
                                crypto.comparePassword(user.password, data.password, user.salt, function (Pres) {
                                    if (Pres) {
                                        userfound = user;
                                    }
                                    callback();
                                })
                            }, function done() {
                                if (userfound) {
                                    var tokenData = {
                                        "_id": userfound._id,
                                        "login_type": "web",
                                        "name": userfound.name,
                                        "role": userfound.role,
                                        "email": userfound.email,
                                        "profile_image": userfound.profile_image,
                                        "createdAt": userfound.createdAt
                                    };
                                    var token = jwt.sign(tokenData, req.configuration.accessEncKey, {
                                        expiresIn: req.configuration.tokenExpiryTime
                                    });
                                    var usData = {
                                        'user': tokenData,
                                        'token': token
                                    }
                                    __res.success(res, 'User validated and login successfully!', usData);
                                } else {
                                    __res.error(res, 'User not found!', [], [], 0);
                                }
                            });
                        } else {
                            __res.error(res, 'User not found!!', [], [], 0);
                        }
                    }
                });
            }
        });
    },

    appLogin: function (req, res, next) {
        var data = {
            email: req.body.email.toLowerCase(),
            password: req.body.password,
            device_type: req.body.device_type,
            device_token: req.body.device_token
        };
        var schema = Joi.object().keys({
            email: Joi.string().required(),
            password: Joi.string().required(),
            device_type: Joi.string().required(),
            device_token: Joi.string().required()
        });
        Joi.validate(data, schema, function (err, value) {
            if (err) {
                __res.error(res, 'Validation errors!', err, [], 0);
            } else {
                models.user.find({
                    email: data.email,
                    role: 'SALES'
                }, function (err, userInfo) {
                    if (err) {
                        __res.error(res, 'Something Went wrong!', err, [], 0);
                    } else {
                        if (userInfo) {
                            var userfound = null;
                            async.eachSeries(userInfo, function iteratee(user, callback) {
                                crypto.comparePassword(user.password, data.password, user.salt, function (Pres) {
                                    if (Pres) {
                                        userfound = user;
                                    }
                                    callback();
                                })
                            }, function done() {
                                if (userfound) {
                                    if (userfound.status == req.configuration.recordStatus.active) {
                                        models.user.findOne({
                                            _id: userfound._id
                                        }, function (err, doc) {
                                            if (err) {
                                                __res.error(res, 'User not found!', err, [], 0);
                                            } else {
                                                doc.device_type = data.device_type;
                                                doc.device_token = data.device_token;
                                                doc.save(function (err, user) {
                                                    if (err) {
                                                        __res.error(res, 'Unabale to detect device!', err, [], 0);
                                                    } else {
                                                        var tokenData = {
                                                            "_id": userfound._id,
                                                            "login_type": "app",
                                                            "name": userfound.name,
                                                            "role": userfound.role,
                                                            "email": userfound.email,
                                                            "phone": userfound.phone,
                                                            "profile_image": userfound.profile_image,
                                                            "push_notification": userfound.push_notification || 0,
                                                            "createdAt": userfound.createdAt
                                                        };
                                                        var token = jwt.sign(tokenData, req.configuration.accessEncKey, {
                                                            expiresIn: req.configuration.tokenExpiryTime
                                                        });
                                                        var usData = {
                                                            'user': tokenData,
                                                            'token': token
                                                        }
                                                        __res.success(res, 'User validated and login successfully!', usData);
                                                    }
                                                });
                                            }
                                        });
                                    } else {
                                        __res.error(res, 'Your account is not active. Please contact admin for activation!', [], [], 0);
                                    }
                                } else {
                                    __res.error(res, 'Please enter correct password!', [], [], 0);
                                }
                            });
                        } else {
                            __res.error(res, 'User not found!!!', [], [], 0);
                        }
                    }
                });
            }
        });
    },

    appLogout: function (req, res, next) {
        models.user.findOne({
            _id: req.user._id
        }, function (err, doc) {
            if (err) {
                __res.error(res, 'User not found!', err, [], 0);
            } else {
                //doc.device_type = '';
                doc.device_token = '';
                doc.save(function (err, user) {
                    if (err) {
                        __res.error(res, 'Something went wrong!', err, [], 0);
                    } else {
                        __res.success(res, 'User logged out successfully!', []);
                    }
                });
            }
        });
    },

    registration: function (req, res, next) {
        var data = {
            name: req.body.name,
            email: req.body.email.toLowerCase(),
            position: req.body.position,
            institution: req.body.institution,
            password: req.body.password,
            phone: req.body.phone
        };
        var schema = Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required(),
            position: Joi.string().required(),
            institution: Joi.string().required(),
            password: Joi.string().required(),
            phone: Joi.string().required()
        });

        Joi.validate(data, schema, function (err, value) {
            if (err) {
                __res.error(res, 'Validation errors!', err, [], 0);
            } else {
                req.utils.unique_check(models.user, 'email', data.email, 'create', 0, function (err) {
                    if (err) {
                        __res.error(res, 'Provided email is already in use!', err, [], 0);
                    } else {
                        crypto.generatePassword(data.password, function (err, salt, cryptedPassword) {
                            if (err) {
                                __res.error(res, 'Something went wrong!', error, [], 0);
                            } else {
                                var user = new models.user({
                                    role: 'SALES',
                                    name: data.name,
                                    position: data.position,
                                    institution: data.institution,
                                    email: data.email,
                                    phone: data.phone,
                                    password: cryptedPassword,
                                    salt: salt,
                                    status: req.configuration.recordStatus.created
                                });
                                user.save(function (err, user) {
                                    if (err) {
                                        __res.error(res, 'Something went wrong!', errs, [], 0);
                                    } else {
                                        var tokenData = {
                                            "_id": user._id,
                                            "name": user.name,
                                            "role": user.role,
                                            "email": user.email,
                                            "profile_image": user.profile_image,
                                            "createdAt": user.createdAt
                                        };
                                        var token = jwt.sign(tokenData, req.configuration.accessEncKey, {
                                            expiresIn: req.configuration.tokenExpiryTime
                                        });
                                        var usData = {
                                            'user': tokenData,
                                            'token': token
                                        }

                                        //Send EMAIL
                                        var templateKey = "app_registration";
                                        var replacement = {
                                            "{{name}}": data.name,
                                            "{{link}}": req.configuration.baseUrl + 'verifyemail/' + user._id
                                        }
                                        req.utils.sendMail(data.email, templateKey, replacement, function (err) {
                                            if (err) {
                                                console.log(err);
                                                __res.success(res, 'Congratulations, You have been registered successfully. Email confirmation mail is not sent.', usData);
                                            } else {
                                                __res.success(res, 'Congratulations, You have been registered successfully. Email confirmation mail is sent to your email id.', usData);
                                            }
                                        });
                                    }
                                });
                            }
                        });

                    }
                });
            }
        });
    },

    getAdminNotifications: function (req, res, next) {
        var notifications = [];
        async.waterfall([
            function (callback) {
                var query = {
                    status: req.configuration.recordStatus.created,
                    role: 'SALES'
                };
                models.user.find(query).exec(function (err, retData) {
                    if (err) {
                        callback(err);
                    } else {
                        if (retData.length > 0) {
                            notifications.push({
                                type: 'new_user',
                                count: retData.length
                            });
                        }
                        callback();
                    }
                });
            },
            function (callback) {
                var query = {
                    status: req.configuration.recordStatus.created,
                    type: 'Q'
                };
                models.query.find(query).exec(function (err, retData) {
                    if (err) {
                        callback(err);
                    } else {
                        if (retData.length > 0) {
                            notifications.push({
                                type: 'new_query',
                                count: retData.length
                            });
                        }
                        callback();
                    }
                });
            }
        ], function (err) {
            if (err) {
                __res.error(res, 'Something Went wrong!', err, [], 0);
            } else {
                __res.success(res, 'Notification list!', notifications);
            }
        });
    },

    updateProfilePic: function (req, res, next) {
        var data = {
            image: req.body.image
        };
        var schema = Joi.object().keys({
            image: Joi.string().required()
        });

        Joi.validate(data, schema, function (err, value) {
            if (err) {
                __res.error(res, 'Validation errors!', err, [], 0);
            } else {
                var user_image = req.user.profile_image;
                var user_data = req.user;
                async.waterfall([
                    function (callback) {
                        var path = 'public/user_profile_pics/';
                        var imgName = req.user._id;
                        req.utils.saveImage(data.image, imgName, path, function (err, imgPath) {
                            if (err) {
                                callback(err);
                            } else {
                                user_image = imgPath;
                                callback();
                            }
                        })
                    },
                    function (callback) {
                        models.user.findOne({
                            _id: req.user._id
                        }, function (err, doc) {
                            if (err) {
                                callback(err);
                            } else {
                                user_data = doc;
                                doc.profile_image = user_image;
                                doc.save(function (err, user) {
                                    if (err) {
                                        callback(err);
                                    } else {
                                        callback(null);
                                    }
                                });
                            }
                        })
                    }
                ], function (errs) {
                    if (errs) {
                        __res.error(res, 'Something went wrong. We are not abale to update your profile picture. Please try again!', errs, [], 0);
                    } else {
                        var resUser = {
                            "_id": user_data._id,
                            "login_type": "app",
                            "name": user_data.name,
                            "role": user_data.role,
                            "email": user_data.email,
                            "phone": user_data.phone,
                            "profile_image": user_image,
                            "create_date": user_data.create_date
                        };
                        var token = jwt.sign(resUser, req.configuration.accessEncKey, {
                            expiresIn: req.configuration.tokenExpiryTime
                        });
                        var usData = {
                            'user': resUser,
                            'token': token
                        }
                        __res.success(res, 'Profile picture is updated successfully.', usData);
                    }
                });
            }
        });
    },

    verifyEmail: function (req, res, next) {
        var data = {
            key: req.body.key
        };
        var schema = Joi.object().keys({
            key: Joi.string().required()
        });

        Joi.validate(data, schema, function (err, value) {
            if (err) {
                __res.error(res, 'Invalid Key!', err, [], 0);
            } else {
                models.user.findOne({
                    _id: data.key,
                    email_varification: {
                        $ne: 1
                    }
                }, function (err, doc) {
                    if (err) {
                        __res.error(res, 'Invalid Key!', err, [], 0);
                    } else {
                        if (doc) {
                            doc.email_varification = '1';
                            doc.save(function (err, user) {
                                if (err) {
                                    __res.error(res, 'Invalid Key!', err, [], 0);
                                } else {
                                    __res.success(res, 'You have verified your email successfully!', {});
                                }
                            });
                        } else {
                            __res.error(res, 'Invalid Key!', [], [], 0);
                        }
                    }
                });
            }
        });
    },

    reqResetPassword: function (req, res, next) {
        var data = {
            email: req.body.email
        };
        var schema = Joi.object().keys({
            email: Joi.string().required()
        });

        Joi.validate(data, schema, function (err, value) {
            if (err) {
                __res.error(res, 'Validation errors!', err, [], 0);
            } else {
                models.user.findOne({
                    email: data.email
                }, function (err, doc) {
                    if (err) {
                        __res.error(res, 'Something went wrong! Please try again.', err, [], 0);
                    } else {
                        if (doc) {
                            var reset_code = doc._id + new Date().getTime();
                            var user_name = doc.name;
                            doc.reset_pwd_code = reset_code;
                            doc.save(function (err, user) {
                                if (err) {
                                    __res.error(res, 'Something went wrong! Please try again.', err, [], 0);
                                } else {
                                    var templateKey = "reset_password";
                                    var replacement = {
                                        "{{name}}": user_name,
                                        "{{link}}": req.configuration.baseUrl + 'resetpassword/' + reset_code
                                    }
                                    req.utils.sendMail(data.email, templateKey, replacement, function (err) {
                                        if (err) {
                                            console.log(err);
                                            __res.error(res, 'Something went wrong! Mail not sent. Please try again.', err, [], 0);
                                        } else {
                                            __res.success(res, 'Your reset password link is sent to your registered email id. Please use that url to reset your password.', []);
                                        }
                                    });
                                }
                            });
                        } else {
                            __res.error(res, 'Invalid E-Mail address!', [], [], 0);
                        }
                    }
                });
            }
        });
    },

    chkReSetPassword: function (req, res, next) {
        var data = {
            key: req.body.key
        };
        var schema = Joi.object().keys({
            key: Joi.string().required()
        });

        Joi.validate(data, schema, function (err, value) {
            if (err) {
                __res.error(res, 'Validation errors!', err, [], 0);
            } else {
                models.user.findOne({
                    reset_pwd_code: data.key
                }, function (err, doc) {
                    if (err) {
                        __res.error(res, 'Invalid key!', err, [], 0);
                    } else {
                        if (doc) {
                            __res.success(res, 'Key is verified.', {});
                        } else {
                            __res.error(res, 'Invalid key!', [], [], 0);
                        }
                    }
                });
            }
        });
    },

    resetPassword: function (req, res, next) {
        var data = {
            key: req.body.key,
            password: req.body.password
        };
        var schema = Joi.object().keys({
            key: Joi.string().required(),
            password: Joi.string().required()
        });

        Joi.validate(data, schema, function (err, value) {
            if (err) {
                __res.error(res, 'Validation errors!', err, [], 0);
            } else {
                crypto.generatePassword(data.password, function (err, salt, cryptedPassword) {
                    if (err) {
                        __res.error(res, 'Something went wrong!', error, [], 0);
                    } else {
                        models.user.findOne({
                            reset_pwd_code: data.key
                        }, function (err, doc) {
                            if (err) {
                                __res.error(res, 'You have already set your login password.', err, [], 0);
                            } else {
                                if (doc) {
                                    doc.reset_pwd_code = '';
                                    doc.password = cryptedPassword;
                                    doc.salt = salt;
                                    doc.save(function (err, user) {
                                        if (err) {
                                            __res.error(res, 'Invalid Key!', err, [], 0);
                                        } else {
                                            __res.success(res, 'You have successfully updated your login password!', {});
                                        }
                                    });
                                } else {
                                    __res.error(res, 'Invalid Key!', [], [], 0);
                                }
                            }
                        });
                    }
                });
            }
        });
    },

    updatePassword: function (req, res, next) {
        var data = {
            current_password: req.body.current_password,
            password: req.body.password
        };
        var schema = Joi.object().keys({
            current_password: Joi.string().required(),
            password: Joi.string().required()
        });

        Joi.validate(data, schema, function (err, value) {
            if (err) {
                __res.error(res, 'Validation errors!', err, [], 0);
            } else {
                models.user.findOne({
                    _id: models.mongoose.Types.ObjectId(req.user._id)
                }).exec(function (err, retData) {
                    if (err) {
                        __res.error(res, 'No user found!', err, [], 0);
                    } else {
                        crypto.comparePassword(retData.password, data.current_password, retData.salt, function (Pres) {
                            if (Pres) {
                                crypto.generatePassword(data.password, function (err, salt, cryptedPassword) {
                                    if (err) {
                                        __res.error(res, 'Something went wrong!', error, [], 0);
                                    } else {
                                        retData.password = cryptedPassword;
                                        retData.salt = salt;
                                        retData.save(function (err, user) {
                                            if (err) {
                                                __res.error(res, 'Password not saved please try again!', err, [], 0);
                                            } else {
                                                __res.success(res, 'You have successfully updated your login password!', {});
                                            }
                                        });
                                    }
                                });
                            } else {
                                __res.error(res, 'You have entered wrong current password!', [], [], 0);
                            }
                        })
                    }
                });
            }
        });
    },

    updateUserStatus: function (req, res, next) {
        var data = {
            familymember_id: req.body.familymember_id
        };
        var schema = Joi.object().keys({
            familymember_id: Joi.string().required()
        });

        Joi.validate(data, schema, function (err, value) {
            if (err) {
                __res.error(res, 'Validation errors!', err, [], 0);
            } else {
                models.user.findOne({
                    _id: models.mongoose.Types.ObjectId(data.familymember_id)
                }, function (err, doc) {
                    if (err) {
                        __res.error(res, 'Something went wrong! Please try again.', err, [], 0);
                    } else {
                        if (doc) {
                            doc.status = (doc.status == req.configuration.recordStatus.active) ? req.configuration.recordStatus.inactive : req.configuration.recordStatus.active;
                            doc.save(function (err, user) {
                                if (err) {
                                    __res.error(res, 'Something went wrong! Please try again.', err, [], 0);
                                } else {
                                    var msg = (user.status == req.configuration.recordStatus.active) ? "Member activated successfully!" : "Member deactivated successfully!";
                                    __res.success(res, msg, user);
                                }
                            });
                        } else {
                            __res.error(res, 'No member found!', [], [], 0);
                        }
                    }
                });
            }
        });
    },

    getMyProfile: function (req, res, next) {
        var query = {
            status: req.configuration.recordStatus.active,
            _id: models.mongoose.Types.ObjectId(req.user._id)
        };

        models.user.findOne(query, function (err, userData) {
            if (err) {
                __res.error(res, 'User not found!', err, [], 0);
            } else {
                __res.success(res, 'Profile found!', userData);
            }
        });
    },

    updateSAProfile: function (req, res, next) {

        var data = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone
        };
        var schema = Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required(),
            phone: Joi.string().optional(),
        });

        Joi.validate(data, schema, function (err, value) {
            if (err) {
                __res.error(res, 'Validation errors!', err, [], 0);
            } else {
                req.utils.unique_check(models.user, 'email', data.email, 'update', req.user._id, function (err) {
                    if (err) {
                        __res.error(res, 'Provided email is already in use!', err, [], 0);
                    } else {
                        models.user.findOne({
                            _id: req.user._id
                        }, function (err, doc) {
                            if (err) {
                                __res.error(res, 'User not found!', err, [], 0);
                            } else {
                                doc.name = data.name;
                                doc.email = data.email;
                                doc.phone = data.phone;

                                doc.save(function (err, userfound) {
                                    if (err) {
                                        __res.error(res, 'Something went wrong!', err, [], 0);
                                    } else {
                                        var tokenData = {
                                            "_id": userfound._id,
                                            "login_type": "web",
                                            "name": userfound.name,
                                            "role": userfound.role,
                                            "email": userfound.email,
                                            "profile_image": userfound.profile_image,
                                            "createdAt": userfound.createdAt
                                        };
                                        __res.success(res, 'Updated successfully!', tokenData);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    },

    updateMyProfile: function (req, res, next) {

        var data = {
            name: req.body.name,
            //email: req.body.email,
            phone: req.body.phone,
            position: req.body.position,
            institution: req.body.institution,
            gender: req.body.gender || '',
            dob: req.body.dob || '',
            address: req.body.address || '',
            state: req.body.state,
            city: req.body.city || '',
            zip: req.body.zip || '',
            twitter_handle: req.body.twitter_handle
        };
        var schema = Joi.object().keys({
            name: Joi.string().required(),
            //email: Joi.string().required(),
            phone: Joi.string().required(),
            position: Joi.string().required(),
            institution: Joi.string().required(),
            gender: Joi.any().optional(),
            dob: Joi.any().optional(),
            address: Joi.any().optional(),
            state: Joi.any().optional(),
            city: Joi.any().optional(),
            zip: Joi.any().optional(),
            twitter_handle: Joi.any().optional()
        });

        Joi.validate(data, schema, function (err, value) {
            if (err) {
                __res.error(res, 'Validation errors!', err, [], 0);
            } else {
                models.user.findOne({
                    _id: req.user._id
                }, function (err, doc) {
                    if (err) {
                        __res.error(res, 'User not found!', err, [], 0);
                    } else {
                        doc.name = data.name;
                        //doc.email = data.email;
                        doc.phone = data.phone;
                        doc.position = data.position;
                        doc.institution = data.institution;
                        doc.gender = data.gender;
                        doc.dob = data.dob;
                        doc.address = data.address;
                        doc.state = data.state;
                        doc.city = data.city;
                        doc.zip = data.zip;
                        doc.twitter_handle = data.twitter_handle;

                        doc.save(function (err, user) {

                            if (err) {
                                __res.error(res, 'Something went wrong!', err, [], 0);
                            } else {
                                __res.success(res, 'Updated successfully!', []);
                            }
                        });
                    }
                });
            }
        });
    },

    get: function (req, res, next) {
        if (req.utils.notEmpty(req.query.id)) {
            models.user.findOne({
                _id: req.query.id,
                role: 'SALES'
            }, function (err, userData) {
                if (err) {
                    __res.error(res, 'User not found!', err, [], 0);
                } else {
                    __res.success(res, 'User found!', userData);
                }
            });
        } else {
            __res.error(res, 'Please provide id!', [], [], 0);
        }
    },

    getAll: function (req, res, next) {

        var returnData = {
            total_count: 0,
            data: []
        }
        var page = parseInt(req.query.page) - 1 || 0;
        var limit = parseInt(req.query.limit) || 10;
        var offset = limit * page;

        var query = {
            status: {
                $ne: req.configuration.recordStatus.delete
            },
            role: 'SALES'
        };
        if (req.utils.notEmpty(req.query.name)) {
            query.name = new RegExp('^' + req.query.name, "i");
        }
        if (req.utils.notEmpty(req.query.email)) {
            query.email = new RegExp('^' + req.query.email, "i");
        }
        if (req.utils.notEmpty(req.query.status)) {
            query.status = req.query.status;
        }
        async.waterfall([
                function (callback) {
                    models.user.find(query)
                        .exec(function (err, retData) {
                            if (err) {
                                callback(err);
                            } else {
                                returnData.total_count = retData.length;
                                callback();
                            }
                        });
                },
                function (callback) {
                    models.user.find(query)
                        .sort({
                            createdAt: -1
                        })
                        .skip(offset).limit(limit)
                        .exec(function (err, retData) {
                            if (err) {
                                callback(err);
                            } else {
                                returnData.data = retData;
                                callback();
                            }
                        });
                }
            ],
            function (err) {
                if (err) {
                    __res.error(res, 'Something Went wrong!', err, [], 0);
                } else {
                    __res.success(res, 'Providers found!', returnData);
                }
            });
    },

    save: function (req, res, next) {
        var data = {
            role: req.body.role,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone
        };
        var schema = Joi.object().keys({
            role: Joi.string().required(),
            name: Joi.string().required(),
            email: Joi.string().required(),
            phone: Joi.string().required()
        });

        Joi.validate(data, schema, function (err, value) {
            if (err) {
                __res.error(res, 'Validation errors!', err, [], 0);
            } else {
                req.utils.user_unique_check(models, 'email', data.email, 'create', 0, 'clinicstaff', req.user.parent, function (err) {
                    if (err) {
                        __res.error(res, 'Provided email is already in use!', err, [], 0);
                    } else {
                        req.utils.user_unique_check(models, 'phone', data.phone, 'create', 0, 'clinicstaff', req.user.parent, function (err) {
                            if (err) {
                                __res.error(res, 'Provided phone no. is already in use!', err, [], 0);
                            } else {
                                var roleID = data.role;
                                if (data.role == 'patient') {
                                    roleID = req.configuration.default_user_type.patient;
                                } else if (data.role == "adminstaff") {
                                    roleID = req.configuration.default_user_type.adminstaff;
                                }
                                var user = new models.user({
                                    role: roleID,
                                    parent: req.user.parent,
                                    name: data.name,
                                    email: data.email,
                                    phone: data.phone,
                                    password_status: 0,
                                    status: req.configuration.recordStatus.inactive
                                });

                                user.save(function (err, retData) {
                                    if (err) {
                                        __res.error(res, 'Something went wrong!', err, [], 0);
                                    } else {

                                        //Send SMS
                                        var message = "Hello " + data.name + ", You have been registered successfully with ERstate. Use the url below to set your password. " + req.configuration.baseUrl + 'setpassword/' + user._id
                                        req.utils.sendSMS(data.phone, message, function (err) {
                                            if (err) {
                                                //__res.error(res, 'Unabale to send OTP. Please try again!', err, [], 0);
                                            } else {
                                                //__res.success(res, 'OTP is sent to the registered mobile no!', {});
                                            }
                                        });

                                        //Send Email  
                                        var templateKey = "provider_registration";
                                        var replacement = {
                                            "{{name}}": data.name,
                                            "{{link}}": req.configuration.baseUrl + 'setpassword/' + user._id
                                        }
                                        if (data.role == 'patient') {
                                            templateKey = "add_patient";
                                        } else if (data.role == "adminstaff") {
                                            templateKey = "add_admin_staff";
                                            replacement = {
                                                "{{name}}": data.name,
                                                "{{link}}": req.configuration.baseUrl + 'admin/setpassword/' + user._id
                                            }
                                        }

                                        req.utils.sendMail(data.email, templateKey, replacement, function (err) {
                                            var msgUser = "Provider";
                                            if (data.role == 'patient') {
                                                msgUser = "Patient";
                                            } else if (data.role == "adminstaff") {
                                                msgUser = "Staff";
                                            }
                                            if (err) {
                                                console.log(err);
                                                __res.success(res, msgUser + ' added successfully. Password creation email is not sent.', []);
                                            } else {
                                                __res.success(res, msgUser + ' added successfully. Password creation email is sent to the email id.', []);
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    },

    update: function (req, res, next) {
        var data = {
            _id: req.body._id,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            position: req.body.position,
            institution: req.body.institution,
            status: req.body.status

        };
        var schema = Joi.object().keys({
            _id: Joi.string().required(),
            name: Joi.string().required(),
            email: Joi.string().required(),
            phone: Joi.string().required(),
            position: Joi.string().required(),
            institution: Joi.string().required(),
            status: Joi.number().required()
        });

        Joi.validate(data, schema, function (err, value) {
            if (err) {
                __res.error(res, 'Validation errors!', err, [], 0);
            } else {
                req.utils.unique_check(models.user, 'email', data.email, 'update', data._id, function (err) {
                    if (err) {
                        __res.error(res, 'Provided email is already in use!', err, [], 0);
                    } else {
                        models.user.findOne({
                            _id: data._id
                        }, function (err, doc) {
                            if (err) {
                                __res.error(res, 'User not found!', err, [], 0);
                            } else {
                                var isStatusUpdated = (doc.status != data.status) ? true : false;
                                doc.name = data.name;
                                doc.email = data.email;
                                doc.phone = data.phone;
                                doc.position = data.position;
                                doc.institution = data.institution;
                                doc.status = data.status;

                                doc.save(function (err, user) {
                                    if (err) {
                                        __res.error(res, 'Something went wrong!', err, [], 0);
                                    } else {
                                        if (isStatusUpdated && data.status == req.configuration.recordStatus.active) {
                                            var templateKey = "account-activated";
                                            var replacement = {
                                                "{{name}}": data.name
                                            }
                                            req.utils.sendMail(data.email, templateKey, replacement, function (err) {
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                    console.log('Mail Send!');
                                                }
                                            });
                                        }
                                        __res.success(res, 'User details updated successfully!', []);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    },

    delete: function (req, res, next) {
        if (req.utils.notEmpty(req.body._id)) {
            var userData = {
                status: req.configuration.recordStatus.delete
            };

            models.user.findOneAndUpdate({
                _id: req.body._id
            }, {
                $set: userData
            }, function (err, retData) {
                if (err) {
                    __res.error(res, 'Something went wrong!', err, [], 0);
                } else {
                    __res.success(res, 'Deleted successfully!', []);
                }
            });
        } else {
            __res.error(res, 'Please select a record!', [], [], 0);
        }
    },

    updatePushNotification: function (req, res, next) {
        if (req.utils.notEmpty(req.user._id)) {
            models.user.findOne({
                _id: req.user._id
            }, function (err, doc) {
                if (err) {
                    __res.error(res, 'Something went wrong!', err, [], 0);
                } else {
                    doc.push_notification = (doc.push_notification == 1) ? 0 : 1;
                    doc.save(function (err, user) {
                        if (err) {
                            __res.error(res, 'Something went wrong!', err, [], 0);
                        } else {
                            __res.success(res, 'Push notification status updated successfully!', {
                                'push_notification': user.push_notification
                            });
                        }
                    });
                }
            });
        } else {
            __res.error(res, 'User not found!', [], [], 0);
        }
    },

    getMyNotifications: function (req, res, next) {
        models.appnotification.find({
            createdAt: {
                $gt: req.user.createdAt
            },
            viewers: {
                $nin: [req.user._id]
            }
        }, function (err, notificationData) {
            if (err) {
                __res.error(res, 'Something went wrong!', err, [], 0);
            } else {
                __res.success(res, 'Notification data!', notificationData);
            }
        });
    },

    updateMyNotification: function (req, res, next) {
        if (req.utils.notEmpty(req.body._id)) {
            models.appnotification.update({
                _id: req.body._id
            }, {
                $push: {
                    viewers: req.user._id
                }
            }, function (err, doc) {
                if (err) {
                    __res.error(res, 'Something went wrong!', err, [], 1);
                } else {
                    __res.success(res, 'Notification updated successfully!', []);
                }
            });
        } else {
            __res.error(res, 'Notification not found!', [], [], 0);
        }
    }
}