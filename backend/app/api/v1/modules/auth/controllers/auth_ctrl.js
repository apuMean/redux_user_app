var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({
    extended: false
}));
router.use(bodyParser.json());

var jwt = require('jsonwebtoken');
var config = require('../config');







var AuthGroup = __rootRequire('models/auth_group.js');
var AuthPermission = __rootRequire('models/auth_permission.js');
var AuthGroupAuthPermission = __rootRequire('models/auth_group_auth_permission.js');
var UserAuthGroup = __rootRequire('models/user_auth_group.js');
var UserAuthPermission = __rootRequire('models/user_auth_permission.js');
var userModel = __rootRequire('models/user.js');
var Joi = require('joi');
var moment = require('moment');
var crypto = __rootRequire('app/utils/crypto');
var config = __rootRequire('app/config/config');
var request = require('request');
var async = require("async");
var noErr = true;

module.exports = {
    createAuthGroup: createAuthGroup,
    getAuthGroup: getAuthGroup,
    deleteAuthGroup: deleteAuthGroup,
    createAuthPermission: createAuthPermission,
    getAuthPermission: getAuthPermission,
    deleteAuthPermission: deleteAuthPermission,
    assignPermissionToUser: assignPermissionToUser,
    removeUserPermission: removeUserPermission,
    assignPermissionToGroup: assignPermissionToGroup,
    removeGroupPermission: removeGroupPermission,
    assignAuthGroupToUser: assignAuthGroupToUser,
    removeUserFromGroup: removeUserFromGroup,
    getUserAuthGroups: getUserAuthGroups,
    getAuthGroupUsers: getAuthGroupUsers,
    getUserAuthPermission: getUserAuthPermission,
    getGroupAuthPermission: getGroupAuthPermission,
    getUserCompleteAccessPermission: getUserCompleteAccessPermission
};

/**
 * Function is use to create Auth Group
 * @access private
 * @return json
 * Created by 
 * @smartData Enterprises (I) Ltd
 * Created Date 14th-June-2017
 */
function createAuthGroup(req, res) {
    if (req.body.groupName) {
        new AuthGroup({
                "name": req.body.groupName
            }) //AuthGroup
            .fetch()
            .then(function (result) {
                if (result) {
                    res.status(500).json({
                        status: req.config.statusCode.error,
                        message: "Group already exist with this name."
                    });
                } else {
                    var groupRecord = {
                        "name": req.body.groupName,
                    }
                    new AuthGroup(groupRecord).save().then(function (result) {
                        if (result.attributes) {
                            res.status(200).json({
                                status: req.config.statusCode.success,
                                data: {
                                    'isLoggedIn': true,
                                    'group': result
                                },
                                message: "Group added successfully"
                            });
                        } else {
                            return res.status(500).json({
                                status: req.config.statusCode.error,
                                data: {
                                    'isLoggedIn': false,
                                },
                                error: "Error Occured"
                            });
                        }
                    }).catch(function (err) {
                        return res.status(500).json({
                            status: req.config.statusCode.error,
                            data: {
                                'isLoggedIn': false,
                            },
                            error: "Error Occured"
                        });
                    });
                }
            });
    } else {
        res.status(500).json({
            status: req.config.statusCode.error,
            message: "Group name required."
        });
    }
}


/**
 * Function is use to get Auth Group
 * @access private
 * @return json
 * Created by 
 * @smartData Enterprises (I) Ltd
 * Created Date 14th-June-2017
 */
function getAuthGroup(req, res) {
    new AuthGroup() //AuthGroup
        .fetchAll()
        .then(function (result) {
            if (result) {
                res.status(200).json({
                    status: req.config.statusCode.success,
                    data: {
                        'isLoggedIn': true,
                        'group': result
                    },
                    message: "Group list fetched successfully"
                });
            } else {
                res.status(200).json({
                    status: req.config.statusCode.success,
                    data: {
                        'isLoggedIn': true,
                        'group': result
                    },
                    message: "Record not found."
                });
            }
        }).catch(function (err) {
            return res.status(500).json({
                status: req.config.statusCode.error,
                data: {
                    'isLoggedIn': false,
                },
                error: "Error Occured"
            });
        });
}


/**
 * Function is use to delete Auth Group
 * @access private
 * @return json
 * Created by 
 * @smartData Enterprises (I) Ltd
 * Created Date 14th-June-2017
 */
function deleteAuthGroup(req, res) {
    if (req.body.groupId) {
        new AuthGroup({
                id: req.body.groupId
            })
            .destroy()
            .then(function (result) {
                res.status(200).json({
                    status: req.config.statusCode.success,
                    message: "Group deleted successfully"
                });
            }).catch(function (err) {
                return res.status(500).json({
                    status: req.config.statusCode.error,
                    data: {
                        'isLoggedIn': false,
                    },
                    error: "Error Occured"
                });
            });
    } else {
        res.status(500).json({
            status: req.config.statusCode.error,
            message: "Group id required."
        });
    }
}


/**
 * Function is use to create Auth Permission
 * @access private
 * @return json
 * Created by 
 * @smartData Enterprises (I) Ltd
 * Created Date 14th-June-2017
 */
function createAuthPermission(req, res) {
    if (req.body.authPermName && req.body.authPermCodeName) {
        new AuthPermission({
                "codename": req.body.authPermCodeName
            }) //AuthGroup
            .fetch()
            .then(function (result) {
                if (result) {
                    res.status(500).json({
                        status: req.config.statusCode.error,
                        message: "Code name with this permission already exist."
                    });
                } else {
                    var authPermRecord = {
                        "name": req.body.authPermName,
                        "codename": req.body.authPermCodeName,
                    }
                    new AuthPermission(authPermRecord).save().then(function (result) {
                        if (result.attributes) {
                            res.status(200).json({
                                status: req.config.statusCode.success,
                                data: {
                                    'isLoggedIn': true,
                                    'group': result
                                },
                                message: "Auth Permission added successfully"
                            });
                        } else {
                            return res.status(500).json({
                                status: req.config.statusCode.error,
                                data: {
                                    'isLoggedIn': false,
                                },
                                error: "Error Occured"
                            });
                        }
                    }).catch(function (err) {
                        return res.status(500).json({
                            status: req.config.statusCode.error,
                            data: {
                                'isLoggedIn': false,
                            },
                            error: "Error Occured"
                        });
                    });
                }
            });
    } else {
        res.status(500).json({
            status: req.config.statusCode.error,
            message: "Auth Permission name and code name are required."
        });
    }
}


/**
 * Function is use to get Auth Permission
 * @access private
 * @return json
 * Created by 
 * @smartData Enterprises (I) Ltd
 * Created Date 15th-June-2017
 */
function getAuthPermission(req, res) {
    new AuthPermission() //AuthGroup
        .fetchAll()
        .then(function (result) {
            if (result) {
                res.status(200).json({
                    status: req.config.statusCode.success,
                    data: {
                        'isLoggedIn': true,
                        'permission': result
                    },
                    message: "Permissions list fetched successfully"
                });
            } else {
                res.status(200).json({
                    status: req.config.statusCode.success,
                    data: {
                        'isLoggedIn': true,
                        'permission': result
                    },
                    message: "Record not found."
                });
            }
        }).catch(function (err) {
            return res.status(500).json({
                status: req.config.statusCode.error,
                data: {
                    'isLoggedIn': false,
                },
                error: "Error Occured"
            });
        });
}


/**
 * Function is use to delete Auth Permission
 * @access private
 * @return json
 * Created by 
 * @smartData Enterprises (I) Ltd
 * Created Date 15th-June-2017
 */
function deleteAuthPermission(req, res) {
    if (req.body.permissionId) {
        new AuthPermission({
                id: req.body.permissionId
            })
            .destroy()
            .then(function (result) {
                res.status(200).json({
                    status: req.config.statusCode.success,
                    message: "Permission deleted successfully"
                });
            }).catch(function (err) {
                return res.status(500).json({
                    status: req.config.statusCode.error,
                    data: {
                        'isLoggedIn': false,
                    },
                    error: "Error Occured"
                });
            });
    } else {
        res.status(500).json({
            status: req.config.statusCode.error,
            message: "Permission id required."
        });
    }
}



/**
 * Function is use to assign Permission To User
 * @access private
 * @return json
 * Created by 
 * @smartData Enterprises (I) Ltd
 * Created Date 16th-June-2017
 */
function assignPermissionToUser(req, res) {
    if (req.body.auth_permission_id && req.body.user_id) {
        new UserAuthPermission({
                "auth_permission_id": req.body.auth_permission_id,
                "user_id": req.body.user_id
            }) //UserAuthPermission
            .fetch()
            .then(function (result) {
                if (result) {
                    res.status(500).json({
                        status: req.config.statusCode.error,
                        message: "Permission already assigned to this user."
                    });
                } else {
                    var userAuthPermRecord = {
                        "auth_permission_id": req.body.auth_permission_id,
                        "user_id": req.body.user_id,
                    }
                    new UserAuthPermission(userAuthPermRecord).save().then(function (result) {
                        if (result.attributes) {
                            res.status(200).json({
                                status: req.config.statusCode.success,
                                data: {
                                    'isLoggedIn': true,
                                    'userPermission': result
                                },
                                message: "Auth Permission assigned successfully"
                            });
                        } else {
                            return res.status(500).json({
                                status: req.config.statusCode.error,
                                data: {
                                    'isLoggedIn': false,
                                },
                                error: "Error Occured"
                            });
                        }
                    }).catch(function (err) {
                        return res.status(500).json({
                            status: req.config.statusCode.error,
                            data: {
                                'isLoggedIn': false,
                            },
                            error: "Error Occured"
                        });
                    });
                }
            });
    } else {
        res.status(500).json({
            status: req.config.statusCode.error,
            message: "Auth Permission Id and User Id are required."
        });
    }
}

/**
 * Function is use to Remove User Permission
 * @access private
 * @return json
 * Created by 
 * @smartData Enterprises (I) Ltd
 * Created Date 16th-June-2017
 */
function removeUserPermission(req, res) {
    if (req.body.auth_permission_id && req.body.user_id) {
        new UserAuthPermission()
            .where({
                "auth_permission_id": req.body.auth_permission_id,
                "user_id": req.body.user_id
            })
            .destroy()
            .then(function (result) {
                res.status(200).json({
                    status: req.config.statusCode.success,
                    message: "User permission removed successfully"
                });
            }).catch(function (err) {
                return res.status(500).json({
                    status: req.config.statusCode.error,
                    data: {
                        'isLoggedIn': false,
                    },
                    error: "Error Occured"
                });
            });
    }
}

/**
 * Function is use to assign Permission To Group
 * @access private
 * @return json
 * Created by 
 * @smartData Enterprises (I) Ltd
 * Created Date 16th-June-2017
 */
function assignPermissionToGroup(req, res) {
    if (req.body.auth_permission_id && req.body.auth_group_id) {
        new AuthGroupAuthPermission({
                "auth_permission_id": req.body.auth_permission_id,
                "auth_group_id": req.body.auth_group_id
            }) //UserAuthPermission
            .fetch()
            .then(function (result) {
                if (result) {
                    res.status(500).json({
                        status: req.config.statusCode.error,
                        message: "Permission already assigned to this group."
                    });
                } else {
                    var userAuthPermRecord = {
                        "auth_permission_id": req.body.auth_permission_id,
                        "auth_group_id": req.body.auth_group_id,
                    }
                    new AuthGroupAuthPermission(userAuthPermRecord).save().then(function (result) {
                        if (result.attributes) {
                            res.status(200).json({
                                status: req.config.statusCode.success,
                                data: {
                                    'isLoggedIn': true,
                                    'groupPermission': result
                                },
                                message: "Auth Permission assigned successfully"
                            });
                        } else {
                            return res.status(500).json({
                                status: req.config.statusCode.error,
                                data: {
                                    'isLoggedIn': false,
                                },
                                error: "Error Occured"
                            });
                        }
                    }).catch(function (err) {
                        return res.status(500).json({
                            status: req.config.statusCode.error,
                            data: {
                                'isLoggedIn': false,
                            },
                            error: "Error Occured"
                        });
                    });
                }
            });
    } else {
        res.status(500).json({
            status: req.config.statusCode.error,
            message: "Auth Permission Id and Group Id are required."
        });
    }
}

/**
 * Function is use to Remove Group Permission
 * @access private
 * @return json
 * Created by 
 * @smartData Enterprises (I) Ltd
 * Created Date 16th-June-2017
 */
function removeGroupPermission(req, res) {
    if (req.body.auth_permission_id && req.body.auth_group_id) {
        new AuthGroupAuthPermission({
                "auth_permission_id": req.body.auth_permission_id,
                "auth_group_id": req.body.auth_group_id
            })
            .where({
                "auth_permission_id": req.body.auth_permission_id,
                "auth_group_id": req.body.auth_group_id
            })
            .destroy()
            .then(function (result) {
                res.status(200).json({
                    status: req.config.statusCode.success,
                    message: "Group permission removed successfully"
                });
            }).catch(function (err) {
                return res.status(500).json({
                    status: req.config.statusCode.error,
                    data: {
                        'isLoggedIn': false,
                    },
                    error: "Error Occured"
                });
            });
    }
}

/**
 * Function is use to assign Auth Group To User
 * @access private
 * @return json
 * Created by 
 * @smartData Enterprises (I) Ltd
 * Created Date 13th-June-2017
 */
function assignAuthGroupToUser(req, res) {
    if (req.body.user_id && req.body.auth_group_id) {
        new UserAuthGroup({
                "user_id": req.body.user_id,
                "auth_group_id": req.body.auth_group_id
            }) //UserAuthPermission
            .fetch()
            .then(function (result) {
                if (result) {
                    res.status(500).json({
                        status: req.config.statusCode.error,
                        message: "Group already assigned to this user."
                    });
                } else {
                    var userAuthPermRecord = {
                        "user_id": req.body.user_id,
                        "auth_group_id": req.body.auth_group_id,
                    }
                    new UserAuthGroup(userAuthPermRecord).save().then(function (result) {
                        if (result.attributes) {
                            res.status(200).json({
                                status: req.config.statusCode.success,
                                data: {
                                    'isLoggedIn': true,
                                    'groupPermission': result
                                },
                                message: "Group assigned to user successfully"
                            });
                        } else {
                            return res.status(500).json({
                                status: req.config.statusCode.error,
                                data: {
                                    'isLoggedIn': false,
                                },
                                error: "Error Occured"
                            });
                        }
                    }).catch(function (err) {
                        return res.status(500).json({
                            status: req.config.statusCode.error,
                            data: {
                                'isLoggedIn': false,
                            },
                            error: "Error Occured"
                        });
                    });
                }
            });
    } else {
        res.status(500).json({
            status: req.config.statusCode.error,
            message: "User Id and Group Id are required."
        });
    }
}

/**
 * Function is use to Remove Group Permission
 * @access private
 * @return json
 * Created by 
 * @smartData Enterprises (I) Ltd
 * Created Date 16th-June-2017
 */
function removeUserFromGroup(req, res) {
    if (req.body.user_id && req.body.auth_group_id) {
        new UserAuthGroup({
                "user_id": req.body.user_id,
                "auth_group_id": req.body.auth_group_id
            })
            .where({
                "user_id": req.body.user_id,
                "auth_group_id": req.body.auth_group_id
            })
            .destroy()
            .then(function (result) {
                res.status(200).json({
                    status: req.config.statusCode.success,
                    message: "User removed from group successfully"
                });
            }).catch(function (err) {
                return res.status(500).json({
                    status: req.config.statusCode.error,
                    data: {
                        'isLoggedIn': false,
                    },
                    error: "Error Occured"
                });
            });
    }
}

/**
 * Function is use to get User Auth Permission
 * @access private
 * @return json
 * Created by 
 * @smartData Enterprises (I) Ltd
 * Created Date 16th-June-2017
 */
function getUserAuthPermission(req, res) {
    if (req.params.user_id) {
        new UserAuthPermission().query(function (qb) {
            qb.from('user_auth_permission as uap');
            qb.select(bookshelf.knex.raw("uap.*,ap.*"));
            qb.leftJoin('auth_permission AS ap', 'uap.auth_permission_id', 'ap.id').orderBy('uap.id', 'DESC');
            qb.whereRaw('( uap.user_id = ?)', [req.params.user_id]);
        }).fetchAll({}).then(function (result) {
            if (result) {
                res.status(200).json({
                    status: req.config.statusCode.success,
                    data: result,
                    message: "User Permission fetched successfully."
                });
            } else {
                res.status(500).json({
                    status: req.config.statusCode.error,
                    message: "Data not found."
                });
            }
        }).catch(function (err) {
            return res.status(500).json({
                status: req.config.statusCode.error,
                data: {
                    'isLoggedIn': false,
                },
                error: "Error Occured"
            });
        });
    } else {
        res.status(500).json({
            status: req.config.statusCode.error,
            message: "User Id is required."
        });
    }
}
/**
 * Function is use to get User Auth Group Permission
 * @access private
 * @return json
 * Created by 
 * @smartData Enterprises (I) Ltd
 * Created Date 16th-June-2017
 */
function getGroupAuthPermission(req, res) {
    if (req.params.auth_group_id) {
        new AuthGroupAuthPermission().query(function (qb) {
            qb.from('auth_group_auth_permission as au');
            qb.select(bookshelf.knex.raw("au.*,ap.*"));
            qb.leftJoin('auth_permission AS ap', 'au.auth_permission_id', 'ap.id').orderBy('au.id', 'DESC');
            qb.whereRaw('( au.auth_group_id = ?)', [req.params.auth_group_id]);
        }).fetchAll({}).then(function (result) {
            if (result) {
                res.status(200).json({
                    status: req.config.statusCode.success,
                    data: result,
                    message: "Auth Group Permission fetched successfully."
                });
            } else {
                res.status(500).json({
                    status: req.config.statusCode.error,
                    message: "Data not found."
                });
            }
        }).catch(function (err) {
            return res.status(500).json({
                status: req.config.statusCode.error,
                data: {
                    'isLoggedIn': false,
                },
                error: "Error Occured"
            });
        });
    } else {
        res.status(500).json({
            status: req.config.statusCode.error,
            message: "Auth Group Id is required."
        });
    }
}

/**
 * Function is use to get User Complete Access Permission including group
 * @access private
 * @return json
 * Created by 
 * @smartData Enterprises (I) Ltd
 * Created Date 19th-June-2017
 */
function getUserCompleteAccessPermission(req, res) {
    var UserRecord = {};
    var resultData;
    var UserAuthPerm;
    var groupIdArray = [];
    if (req.params.user_id) {
        async.series([ //you can use "async.series" as well            
            function (callback) {
                new UserAuthGroup({
                        "user_id": req.params.user_id
                    }) //UserAuthPermission
                    .fetchAll({
                        columns: ['auth_group_id']
                    }).then(function (result) {
                        if (result) {
                            var resultData = result.toJSON();

                            resultData.map(function (d) {
                                groupIdArray.push(d.auth_group_id);
                            });
                        }
                        UserRecord.groups = resultData;
                        callback();
                    });
            },
            function (callback) {
                new UserAuthPermission().query(function (qb) {
                    qb.from('user_auth_permission as uap');
                    qb.select(bookshelf.knex.raw("uap.*,ap.*"));
                    qb.leftJoin('auth_permission AS ap', 'uap.auth_permission_id', 'ap.id').orderBy('uap.id', 'DESC');
                    qb.whereRaw('( uap.user_id = ?)', [req.params.user_id]);
                }).fetchAll({}).then(function (result) {
                    if (result) {
                        var UserAuthPerm = result.toJSON();
                    }
                    UserRecord.userPrmission = UserAuthPerm;
                    callback();
                });
            },
            function (callback) {
                new AuthGroupAuthPermission().query(function (qb) {
                    qb.from('auth_group_auth_permission as au');
                    qb.select(bookshelf.knex.raw("au.*,ap.*"));
                    qb.leftJoin('auth_permission AS ap', 'au.auth_permission_id', 'ap.id').orderBy('au.id', 'DESC');
                    qb.where('auth_group_id', 'IN', groupIdArray)
                    //qb.whereRaw('( au.auth_group_id in)', [groupIdArray]);
                }).fetchAll({}).then(function (result) {
                    UserRecord.userGroupPrmission = result.toJSON();;
                    callback();
                });
            },
        ], function (err) {
            if (err) {
                return res.status(500).json({
                    status: req.config.statusCode.error,
                    data: {
                        'isLoggedIn': false,
                    },
                    error: err
                });
            } else {
                res.status(200).json({
                    status: req.config.statusCode.success,
                    data: UserRecord,
                    message: "User & Group Permission fetched successfully."
                });
            }
        });
    } else {
        res.status(500).json({
            status: req.config.statusCode.error,
            message: "User Id is required."
        });
    }
}


/**
 * Function is use to get User groups list which they belong
 * @access private
 * @return json
 * Created by 
 * @smartData Enterprises (I) Ltd
 * Created Date 19th-June-2017
 */
function getUserAuthGroups(req, res) {
    new UserAuthGroup().query(function (qb) {
        qb.from('user_auth_group as uag');
        qb.select(bookshelf.knex.raw("uag.*,ag.*"));
        qb.leftJoin('auth_group AS ag', 'ag.id', 'uag.auth_group_id').orderBy('uag.id', 'DESC');
        qb.whereRaw('( uag.user_id = ?)', [req.params.user_id]);
    }).fetchAll({}).then(function (result) {
        var UserAuthGroups = result.toJSON();;
        res.status(200).json({
            status: req.config.statusCode.success,
            data: UserAuthGroups,
            message: "User Group fetched successfully."
        });
    });
}


/**
 * Function is use to get group users list
 * @access private
 * @return json
 * Created by 
 * @smartData Enterprises (I) Ltd
 * Created Date 19th-June-2017
 */
function getAuthGroupUsers(req, res) {
    new UserAuthGroup().query(function (qb) {
        qb.from('user_auth_group as uag');
        qb.select(bookshelf.knex.raw("uag.*,u.fullname,u.username"));
        qb.leftJoin('user AS u', 'u.id', 'uag.user_id').orderBy('uag.id', 'DESC');
        qb.whereRaw('( uag.auth_group_id = ?)', [req.params.auth_group_id]);
    }).fetchAll({}).then(function (result) {
        var AuthGroupsUsers = result.toJSON();;
        res.status(200).json({
            status: req.config.statusCode.success,
            data: AuthGroupsUsers,
            message: "Group Users fetched successfully."
        });
    });
}