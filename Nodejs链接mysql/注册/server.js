const http = require('http');
const url = require('url');
const queryString = require('query-String');
const mysql = require('mysql');

const Server = http.createServer((request, response) => {
  if(request.url != '/favicon.ico'){
    // 设置response的头部信息
  response.writeHead(200, { 'Content-Type': "text/html;charset=utf-8" });
  // 存储用户的注册信息
  let postVal = '';
  // 请求前端注册的数据
  request.on('data', (chunk) => {
    postVal += chunk;
  });
  // 将拿到的注册信息写入数据库
  request.on('end', () => {
    // 用户名
    let username = queryString.parse(postVal).username
    // 密码
    let password = queryString.parse(postVal).password
    // 创建数据库的链接
    const connection = mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: 'abc123',
      database: 'db',
      port: 3306
    });
    // 创建连接
    connection.connect((err) => {
      if (err) {
        console.log('数据库连接失败', `${err}`);
      } else {
        console.log('数据库连接成功');
      }
    });
    // 插入新注册的数据
    connection.query('insert into user value (?,?,?)', [0, username, password], (err, results, fields) => {
      response.write("新用户注册成功！");
      // 结束
      response.end();
    });

    // 关闭数据库的链接
    connection.end();
  });
  }

});

Server.listen(8080, () => {
  console.log('服务开启成功，端口8080...');
})