var config = require('./../config/config');

module.exports = {
    error: function (res, message, errs, data, logErrors) {
        if(logErrors == 1){
            console.log("\x1b[31m", 'Errors: ', errs);
        }
        res.send({
            status: config.statusCode.error,
            error: errs,
            data: data,
            message: message
        });
    },
    authError: function (res, message, errs, logErrors) {
        if(logErrors == 1){
            console.log("\x1b[31m", 'Errors: ', errs);
        }
        res.send({
            status: config.statusCode.authErr,
            error: errs,
            message: message
        });
    },
    success: function (res, message, data) {
        res.send({
            status: config.statusCode.success,
            data: data,
            message: message
        });
    }
};