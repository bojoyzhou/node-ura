var crypto = require('crypto');

var config = {
    secret: ''
};

exports.init = function(secret) {
    config.secret = secret || '';
    return exports;
}

exports.hash = function(msg, secret) {
    secret = secret || config.secret;
    return crypto.createHmac('sha256', config.secret)
        .update(msg)
        .digest('hex');
}
