'use strict';
module.exports = function (router) {
    // var auth = __rootRequire("app/utils/crypto");
    // var middlewares = [auth.ensureAuthorized, auth.ensureAccess];
    var owner = require('./controllers/owner-ctrl');
    router.post('/owners/registerOwner', owner.register);
    router.delete('/owners/delOwner/:id', owner.deleteOwner);
    router.get('/owners/getOwners', owner.getOwners);
    router.post('/owners/login', owner.login);
    return router;
}