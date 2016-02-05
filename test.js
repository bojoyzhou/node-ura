//没有初始化t_user表
//初始化这个表,无异常,无输出
var ura = require('./index');

function case0() {
    ura.init({
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: '1111',
            database: 'd_user'
        }
    })
}

/**进行以下操作时必须保证表已经初始化,数据库能够正确连接**/

//CASE 1.
//注册一个新用户
//返回用户的hashid

function case1() {
    ura.regist('username', 'password').then(function(id) {
        if (id) {
            console.log('case 1 pass...');
        }
    });
}

//CASE 2.
//注册一个用户名重复的用户
//返回错误ER_DUP_USERNAME

function case2() {
    ura.regist('username', 'password').then(function() {}, function(err) {
        if (err === 'ER_DUP_USERNAME') {
            console.log('case 2 pass...');
        }
    });
}

//CASE 3.
//用户名密码正常的情况下验证一个用户
//返回用户的hashid

function case3() {
    ura.auth('username', 'password').then(function(id) {
        console.log('case 3 pass...');
    });

}
//CASE 4.
//用户名不存在的情况下验证一个用户
//返回用户不存在 ER_NOT_EXIST

function case4() {
    ura.auth('notexists', 'password').then(function() {}, function(err) {
        if (err === 'ER_NOT_EXIST') {
            console.log('case 4 pass...');
        }
    });
}

//CASE 5.
//用户名正确密码不正确的情况下验证一个用户
//返回错误 ER_PASS_INVALID

function case5() {
    ura.auth('username', 'pass_invalid').then(function() {}, function(err) {
        if (err === 'ER_PASS_INVALID') {
            console.log('case 5 pass...');
        }
    });
}

//CASE 6.
//重置用户密码
//无异常无输出

function case6() {
    ura.reset('username', 'new_password').then(function() {
        console.log('case 6 pass...');
    });
}


case0();
// case1();
// case2();
// case3();
// case4();
// case5();
// case6();
