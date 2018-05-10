/**
 * Mailer Module to manage emails
 * @version 1.0   
 * @created 6 June, 16
 * @author Mohammad H.
 */
'use strict';
var nodemailer = require("nodemailer"),
    smtpTransport = require('nodemailer-smtp-transport'),
    __ = require('lodash'),
    global_config = __rootRequire('app/config/config');

module.exports = {
    config: __rootRequire('app/config/smtp')[global_config.env],
    instance: null,
    getInstance: function () {
        var _this = this;
        function createInstance() {
            _this.instance = nodemailer.createTransport(_this.config.connectionURL);

        }
        if (_this.instance === null) {
            createInstance();
        }
        return _this.instance;
    },
    replace: function (str, repalcement) {
        var re = new RegExp(Object.keys(repalcement).join("|"), "gi");
        str = str.replace(re, function (matched) {
            return repalcement[matched.toLowerCase()];
        });
        return str;
    },
    getTemplate: function (data) {
        return `
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>OmniSeq</title>
            </head>

            <body style="margin: 0px; padding:0px; -webkit-text-size-adjust:none; -ms-text-size-adjust: none; min-width: 100%;" yahoo="fix">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f2f2f2">
                    <tr>
                        <td>
                            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                                <tr>
                                    <td>
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td bgcolor="#1d5baa" style="background:#20d3b2; color:#ffffff; font-family:Gotham, Helvetica Neue, Helvetica, 'Arial', sans-serif; font-size: 18px; font-weight: 700; padding: 11px 15px; text-align:center;">OmniSeq</td>
                                            </tr>
                                        </table><br />`+
                                        data
                                        +`<table width="100%" border="0" cellpadding="0" cellspacing=""="0">
                                            <tbody>
                                                <tr>
                                                    <td style="font-family:Helvetica, 'Arial'; font-size: 14px; font-weight: normal; line-height:20px; padding: 0px; text-align: left; "
                                                        valign="top">
                                                        <p>Thanks & Regards<br />OmniSeq Team</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table width="100%" border="0" cellpadding="0" cellspacing=""="0" style="background:#20d3b2; color:#fff;">
                                            <tbody>
                                                <tr>
                                                    <td style="font-family:Helvetica, 'Arial'; font-size: 14px; font-weight: normal; line-height:20px; padding: 0px 15px 0 15px; text-align: center; "
                                                        valign="top">
                                                        <p>OmniSeq all right Reserved 2017</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
        `;
    },
    __: function (options) {
        if (typeof (options) === undefined || typeof (options) !== 'object')
            throw Error("First argument is missing or Invalid.");
        var body = options.body;
        return {
            to: options.to,
            subject: options.subject,
            html: this.getTemplate(this.replace(body, options.repalcement))
        };
    },
    sendMail: function (options, callback) {
        options = this.__(options);
        options = __.assign(this.config.options, options);
        this.getInstance().sendMail(options, callback);
    }
};