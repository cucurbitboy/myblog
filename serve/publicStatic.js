var express = require("express");
var path = require("path");
var http = require("http");
var app = express();
// path.join()方法可以连接任意多个路径字符串
// path.resolve()方法可以将多个路径解析为一个规范化的绝对路径
//如此public下所有文件都能直接请求
var publicPath = path.resolve(__dirname, "public");
//mac liunx路径是 /public，window是\public 所有用path.resolve处理兼容
console.log(publicPath); //h:\qinhuansky\demo\vue博客页面\reMyblog\serve\public
//表示在域名后面即可访问:localhost:3001/index.html
app.use(express.static(publicPath));
// 指定前缀的中间件来对静态文件 URL 进行自定义,此方法可以指定多个静态地址（可重名）分别映射
// var publicPath = path.resolve(__dirname, "public");
// var userUploadsPath = path.resolve(__dirname, "uploads");
// app.use("/public", express.static(publicPath));
// app.use("/uploads", express.static(userUploadsPath));

app.use(function(request, response) {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Looks like you didn't find a static file.");
});
http.createServer(app).listen(3800);
// =====================

// 限流
// var limiter = require('connect-ratelimit');
// app = connect()
// .use(limiter({
//   whitelist: ['127.0.0.1'],
//   blacklist: ['example.com']
// }))
// .use(function (req, res) {
//   res.end('Hello world!');
// });