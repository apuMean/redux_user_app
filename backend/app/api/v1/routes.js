'use strict';
module.exports = function (express) {
    var router = express.Router()
    require('./modules/user/user_routes')(router);
    require('./modules/owner/owner_routes')(router);
    // require('./modules/bike/bike_routes')(router);
    return router;
}