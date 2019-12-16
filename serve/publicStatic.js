var express = require("express");
var path = require("path");
var http = require("http");
var app = express();
//如此public下所有文件都能直接请求
var publicPath = path.resolve(__dirname, "public"); 
//mac liunx路径是 /public，window是\public 所有用path.resolve处理兼容
console.log(publicPath)//h:\qinhuansky\demo\vue博客页面\reMyblog\serve\public
app.use(express.static(publicPath)); 
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