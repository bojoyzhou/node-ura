# bj-node-ura

##What?
这是一个提供用户注册验证修改密码的模块 

##Document

- `ura` - object of the module
	- `regist(username, password)` method
	- `auth(username, password)` method
	- `reset(username, password)` method


## Download

`npm install bj-node-ura`

##Start

	var ura = require('bj-node-ura');
	ura.init({
	    client: 'mysql',
	    connection: {
	        host: '127.0.0.1',
	        user: 'root',
	        password: '1111',
	        database: 'd_user'
	    }
	})


	//registration
	ura.regist(username, password).then(function(id) {
	    console.log(id);
	}, function(err) {
	    throw err;
	});

	//authorization
	ura.auth(username, password).then(function(id) {
	    console.log(id);
	}, function(err) {
	    throw err;
	});

	//reset password
    ura.reset('username', 'new_password').then(function() {
        console.log('reset succ');
    }, function(err) {
        throw err;
    });
