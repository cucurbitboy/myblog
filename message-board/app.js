// npm install express morgan body-parser ejs --save
var http = require("http");
var path = require("path");
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");

var app = express();

// 设置引擎
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/page", function(request, response) {
  // Express 给 response 对象添加了一个名为 render 的方法
  response.render("page");
});

// 设置留言的全局变量
var entries = [];
app.locals.entries = entries;

// 使用 Morgan 进行日志记录
app.use(logger("dev"));

// 设置用户表单提交动作信息的中间件，所有信息会保存在 req.body 里
app.use(bodyParser.urlencoded({ extended: false }));

// 当访问了网站根目录，就渲染主页（位于views/index.ejs）
app.get("/", function(request, response) {
  response.render("index");
});

// 渲染“新留言”页面（位于views/index.ejs）当get访问这个URL的时候
app.get("/new-entry", function(request, response) {
  response.render("new-entry");
});

// POST 动作进行留言新建的路由处理
app.post("/new-entry", function(request, response) {
  // 如果用户提交的表单没有标题或者内容，则返回一个 400 的错误
  if (!request.body.title || !request.body.body) {
    response.status(400).send("Entries must have a title and a body.");
    return;
  }
  // 添加新留言到 entries 中
  entries.push({
    title: request.body.title,
    content: request.body.body,
    published: new Date()
  });
  // 重定向到主页来查看你的新条目
  response.redirect("/");
});

// 渲染404页面，因为你请求了未知资源
app.use(function(request, response) {
  response.status(404).render("404");
});

// 在3800端口启动服务器
http.createServer(app).listen(3800, function() {
  console.log("started on port 3800.");
});
