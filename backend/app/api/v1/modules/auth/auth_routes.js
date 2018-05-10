module.exports = function (router) {
    var authToken = __rootRequire("app/utils/crypto");    
    var middlewares = [authToken.ensureAuthorized];
    var auth = require('./controllers/auth_ctrl');
    router.post('/auth/createAuthGroup', auth.createAuthGroup)
    router.get('/auth/getAuthGroup', auth.getAuthGroup)
    router.delete('/auth/deleteAuthGroup', auth.deleteAuthGroup)
    router.post('/auth/createAuthPermission', auth.createAuthPermission)   
    router.get('/auth/getAuthPermission', auth.getAuthPermission)   
    router.delete('/auth/deleteAuthPermission', auth.deleteAuthPermission)   
    router.post('/auth/assignPermissionToUser', auth.assignPermissionToUser)   
    router.delete('/auth/removeUserPermission', auth.removeUserPermission)       
    router.post('/auth/assignPermissionToGroup', auth.assignPermissionToGroup)   
    router.delete('/auth/removeGroupPermission', auth.removeGroupPermission)       
    router.post('/auth/assignAuthGroupToUser', auth.assignAuthGroupToUser)   
    router.delete('/auth/removeUserFromGroup', auth.removeUserFromGroup)       
    router.get('/auth/getUserAuthGroups/:user_id', auth.getUserAuthGroups)   
    router.get('/auth/getAuthGroupUsers/:auth_group_id', auth.getAuthGroupUsers)   
    router.get('/auth/getUserAuthPermission/:user_id', auth.getUserAuthPermission)   
    router.get('/auth/getGroupAuthPermission/:auth_group_id', auth.getGroupAuthPermission)   
    router.get('/auth/getUserCompleteAccessPermission/:user_id', auth.getUserCompleteAccessPermission)   

    return router;
} 