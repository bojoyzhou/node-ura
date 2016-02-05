var hmacsha256 = require('../lib/hmac-sha256');
var moment = require('moment');
var knex = null;

exports.init = function(_knex) {
    knex = _knex;
    knex.schema.hasTable('t_user').then(function(exists) {
        if (!exists) {
            return knex.schema.createTable('t_user', function(t) {
                t.increments('id').primary();
                t.string('hashid', 64).unique();
                t.string('username', 64).unique();
                t.string('passhash', 64);
                t.string('salt', 64);
                t.timestamps();
            }).then(function() {
                // console.log('ok');
            });
        }
    });
};

exports.insert = function(username, passhash, salt) {
    if (!knex) {
        throw Error('db is not inited');
    }
    var hashid = hmacsha256.hash(username, salt);
    var row = {
        hashid,
        username,
        passhash,
        salt,
        created_at: moment().format('YYYY-MM-DD HH:mm:ss')
    };
    return new Promise((resolve, reject) => {
        var id = knex.insert(row).into('t_user').then(function(id) {
            resolve(id);
        }).catch(function(err) {
            if (err.code === 'ER_DUP_ENTRY') {
                reject('ER_DUP_USERNAME');
            } else {
                throw err
            }
        });
    });
}

exports.auth = function(username, password, salt) {
    if (!knex) {
        throw Error('db is not inited');
    }
    return new Promise((resolve, reject) => {
        selectSalt(username)
            .then(function(rows) {
                if (rows.length == 0) {
                    return reject('ER_NOT_EXIST');
                }
                var salt = rows[0].salt;
                var passhash = hmacsha256.hash(password, salt);
                knex.select('hashid').from('t_user').where({
                    username, passhash, salt
                }).then(function(rows) {
                    if (rows.length == 0) {
                        return reject('ER_PASS_INVALID');
                    }
                    resolve(rows[0]);
                });
            });
    });
}

exports.update = function(username, passhash, salt) {
    if (!knex) {
        throw Error('db is not inited');
    }
    return new Promise((resolve, reject) => {
        knex('t_user').where({
            username
        }).update({
            passhash,
            salt,
            'updated_at': moment().format('YYYY-MM-DD HH:mm:ss')
        }).then(function(data) {
            resolve();
        }).catch(function(err) {
            console.log(err);
        });
    });
}

function selectSalt(username) {
    return new Promise((resolve, reject) => {
        knex.select('salt').from('t_user').where('username', username).then(function(rows) {
            resolve(rows);
        }).catch(function(err) {
            reject(err);
        });
    });
}


// exports.insert('hashid1', 'username', 'passhash', 'salt')
// exports.selectSalt('username')
// exports.auth('username', 'passhash', 'salt').then(function(data) {
//     console.log(data);
// }, function(err) {
//     console.log(err);
// });
