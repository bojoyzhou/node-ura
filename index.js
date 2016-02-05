var crypto = require('crypto');
var hmacsha256 = require('./lib/hmac-sha256');
var model = require('./model');
var knex = null;

exports.init = function(dbconfig) {
    dbconfig = dbconfig || require('../config/config');
    knex = require('knex')(dbconfig);
    model.init(knex);
}
exports.regist = function(username, password) {
    if (!knex) {
        throw Error('db is not inited');
    }
    return new Promise((resolve, reject) => {
        genSalt()
            .then(function(salt) {
                var passhash = hmacsha256.hash(password, salt);
                model.insert(username, passhash, salt).then(resolve, reject);
            });
    });
}

exports.auth = function(username, password, callback) {
    if (!knex) {
        throw Error('db is not inited');
    }
    return model.auth(username, password, callback)
}

exports.reset = function(username, password, callback) {
    if (!knex) {
        throw Error('db is not inited');
    }
    return new Promise((resolve, reject) => {
        genSalt()
            .then(function(salt) {
                var passhash = hmacsha256.hash(password, salt);
                model.update(username, passhash, salt).then(resolve, reject);
            });
    });
}

function genSalt() {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(64, (err, buf) => {
            if (err) throw err;
            // console.log(buf.toString('ascii'),buf.toString('ascii').length);
            resolve(buf.toString('ascii'));
        });
    });
}
