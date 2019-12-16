var express = require("express");
var path = require("path");
var http = require("http");
var app = express();
// ip黑名单
var EVIL_IP = "192.172.8.16";

// 告诉 Express 你将使用EJS模板引擎
app.set("view engine", "ejs");
// 告诉 Express 你的视图存在于一个名为 views 的文件夹中
app.set("views", path.resolve(__dirname, "views"));
app.get("/page", function(request, response) {
  // Express 给 response 对象添加了一个名为 render 的方法
  response.render("page", {
    message: "I is ejs"
  });
});

// 像之前一样设置静态文件中间件。
// 所有的请求通过这个中间件，如果没有文件被找到的话会继续前进
// var publicPath = path.resolve(__dirname, "public");
// app.use(express.static(publicPath));

// 当请求根目录的时候被调用
app.get("/", function(request, response, next) {
  console.log(request.ip);
  console.log(request);
  if (request.ip === EVIL_IP) {
    // req.ip 以及 res.status() 和 res.send()
    response.status(401).send("Not allowed!");
  } else {
    next();
  }
});

// 当请求/about的时候被调用
app.get("/img", function(request, response) {
  response.sendFile("path/to/cool_song.mp3");
});

// 当请求/weather的时候被调用
app.get("/weather", function(request, response) {
  debugger;
  // response.end("The current weather is NICE.");
  //重定向
  // response.redirect("/hello/world");
  response.redirect("http://baidu.com");
});

// 指定“hello”为路由的固定部分
app.get("/hello/:who", function(request, response) {
  // :who 并不是固定住，它表示 URL 中传递过来的名字
  response.end("Hello, " + request.params.who + ".");
});

// 前面都不匹配，则路由错误。返回 404 页面
app.use(function(request, response) {
  response.statusCode = 404;
  response.end("404");
});
http.createServer(app).listen(3800);
