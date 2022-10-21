const http = require('http');
const queryString = require('query-string');
const url = require('url');
const mysql = require('mysql');


const Server = http.createServer((req, res) => {
  // 设置格式
  res.writeHead(200, { 'Content-Type': "text/html;charset=utf8" });
  // 存放用户输入的信息；
  let LoginVal = '';
  req.on('data', (chunk) => {
    LoginVal += chunk;
  });
  // 整理用户名和密码
  req.on('end', () => {
    // 用户输入的名字和密码
    let username = queryString.parse(LoginVal).username;
    let password = queryString.parse(LoginVal).password;
    // 创建数据库的链接
    connection = mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: 'abc123',
      database: 'db',
      port: 3306
    });
    // 链接数据库
    connection.connect((err) => {
      if (err) {
        console.log('mysql数据库连接失败！', `${err}`);
      } else {
        console.log('数据库连接成功！');
      }
    });
    // 进行数据库数据查询
    connection.query('select * from user where username = ? and password = ?', [username, password], (err, results, fields) => {
      if (err) throw err;
      if (results.length > 0) {
        res.write("登录成功")
        res.end();
      } else {
        res.write("用户名密码错误")
        res.end();
      }
    });

    connection.end();
  });
});

Server.listen(8080);