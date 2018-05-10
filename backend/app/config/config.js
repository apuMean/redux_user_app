var path = require('path');
module.exports = {
    accessEncKey: 'asjhdf345gsakj$kamskgfhjasg&kjdnsfrkjdsbhfada85sdgfs723dfgfds',
    secret: 'secretkey',
    salt: 2,
    env: (process.env.NODE_ENV == 'production') ? "production" : "development",
    baseUrl: (process.env.NODE_ENV == 'production') ? "http://52.34.207.5:5091/" : "http://localhost:5091/",
    androidPushKey: 'AIzaSyDF4AcolWZgS-14I_sHWSFHDiYAyXtHBxY',
    iosPushKey: {
        gateway: "gateway.push.apple.com",
        port: 2195,
        cacheLength: 5,
        enhanced: true,
        keyFile: path.join(__dirname, './../core/apns_files/sd/prod/erMobile_KeyR.pem'),
        certFile: path.join(__dirname, './../core/apns_files/sd/prod/erMobile_CertR.pem'),
        debug: true,
        passphrase: '1234'
    },
    tokenExpiryTime: '24 hours',
    MaxUploadSixe: 1024 * 1024 * 10,
    fileTypes: {
        'image/gif': 'image',
        'image/jpeg': 'image',
        'image/png': 'image'
    },
    database: (process.env.NODE_ENV == 'production') ? {
        uri: 'mongodb://localhost:27017/OmniSeq',
        user: 'OmniSeq',
        pass: 'Ghtr23svwA3'
    } : {
        uri: 'mongodb://52.34.207.5:27017/OmniSeq',
        user: 'OmniSeq',
        pass: 'Ghtr23svwA3'
    },
    statusCode: {
        'success': 200,
        'error': 201,
        'emailOtp': 202,
        'authErr': 203,
        'accessErr': 204,
        'emailOtpError': 205
    },
    recordStatus: {
        'created': 0,
        'active': 1,
        'inactive': 2,
        'delete': 3
    }
};