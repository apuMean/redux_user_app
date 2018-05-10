// var crypto = __rootRequire('app/utils/crypto');
var crypto = require('crypto');

module.exports = function (router) {

    var user = require('./controllers/user-ctrl')
    // router.get('/user/checklogin', user.checklogin)
    // router.post('/user/adminlogin', user.adminLogin)
    // router.post('/user/applogin', user.appLogin)
    router.post('/users/registerUser', user.register);
    router.get('/users/getUsers', user.getUsers);
    router.post('/users/delUser', user.deleteUser);
    router.post('/users/login', user.login);
    router.get('/users/getUserById',user.getUserById)
    router.post('/users/editUser',user.editUser)


    // router.post('/user/applogout', crypto.ensureAuthorized, user.appLogout)
    // router.get('/user/getadminnotifications', crypto.ensureAuthorized, user.getAdminNotifications)
    // router.post('/user/registration', user.registration)
    // router.post('/user/verifyemail', user.verifyEmail)

    // router.post('/user/updateuserstatus', crypto.ensureAuthorized, user.updateUserStatus)
    // router.post('/user/updateprofilepic', crypto.ensureAuthorized, user.updateProfilePic)
    // router.get('/user/getprofile', crypto.ensureAuthorized, user.getMyProfile)
    // router.post('/user/updateprofile', crypto.ensureAuthorized, user.updateMyProfile)
    // router.post('/user/updatesaprofile', crypto.ensureAuthorized, user.updateSAProfile)

    // router.post('/user/reqresetpassword', user.reqResetPassword)
    // router.post('/user/chkresetpasswordkey', user.chkReSetPassword)
    // router.post('/user/resetpassword', user.resetPassword)
    // router.post('/user/updatepassword', crypto.ensureAuthorized, user.updatePassword)

    // router.get('/appuser/get', crypto.ensureAuthorized, crypto.ensureAccess, user.get)
    // router.get('/appuser/getall', crypto.ensureAuthorized, crypto.ensureAccess, user.getAll)
    // router.post('/appuser/add', crypto.ensureAuthorized, crypto.ensureAccess, user.save)
    // router.post('/appuser/edit', crypto.ensureAuthorized, crypto.ensureAccess, user.update)
    // router.post('/appuser/delete', crypto.ensureAuthorized, crypto.ensureAccess, user.delete)

    // router.post('/appuser/updatepushnotification', crypto.ensureAuthorized, crypto.ensureAccess, user.updatePushNotification)
    // router.post('/appuser/updatemynotifications', crypto.ensureAuthorized, crypto.ensureAccess, user.updateMyNotification)
    // router.get('/appuser/getmynotifications', crypto.ensureAuthorized, crypto.ensureAccess, user.getMyNotifications)

    return router;
}