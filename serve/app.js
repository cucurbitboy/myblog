// var url = require("url");   
// var parsedURL = url.parse("http://www.example.com/profile?name=barry");  
// console.log(parsedURL.protocol);  // "http:"
// console.log(parsedURL.host);       // "www.example.com"
// console.log(parsedURL.query);     // "name=barry
// Returns "Hello, Nicholas Cage!"
// ====================================

// npm install Mustache --save
// var Mustache = require('mustache')
// var aa = Mustache.render("Hello, {{first}} {{last}}!", {
//   first: "Nicholas",
//   last: "Cage"
// });
// console.log(aa)
// ====================================

// var fs = require("fs");  
// var options = { encoding: "utf-8" };                      
// fs.readFile("text.txt", options, function(err, data) {  
//   if (err) {                                
//     console.error("Error reading file!");   
//     return;                                 
//   }                                        
//   console.log(data);  
// });
// ====================================

// var http = require("http");           
// function requestHandler(request, response) {  
// response.writeHead(200, {"Content-Type": "text/plain"}) 
//   let type = request.url;
//   if(type == "/index"){
//     response.end('wellcome index')
//   } else if(type == "/home"){
//     response.end('wellcome home')
//   }else{
//     response.end('404')
//   }
//   console.log(`request to ${type}`);              
// }                                                        
// var server = http.createServer(requestHandler);  
// server.listen(3800);
// ====================================

// npm install express --save
// npm install morgan --save  日志
// cnpm install file-stream-rotator --save
var express = require("express");  
var logger = require("morgan");
var FileStreamRotator = require('file-stream-rotator');
var fs = require("fs")
var http = require("http");
var app = express(); 
var logDirectory = __dirname + '/log';
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
var accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: logDirectory + '/%DATE%.log',
  frequency: 'daily',
  verbose: false
});
app.use(logger('combined', {stream: accessLogStream}));

// 当前目录创建access.log打印所有请求
// var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'});
// app.use(logger('combined', {stream: accessLogStream}));

// 自定义日志记录中间件
app.use(function(request, response, next) {
  console.log("In comes a " + request.method + " to " + request.url);
  next();
});
//发送实际响应
app.use((request, response, next) => {
  response.writeHead(200, {"Content-Type": "text/plain"})
  let minutes = (new Date()).getMinutes();
  // 中间件自上而下执行通过next过渡
  if((minutes % 2) === 0){
    next()
  }else{
    response.statusCode = 403;
    response.end("Not authorized.");
  }
}) 
app.use(function(request, response) {
  if(request.url == "/"){
    response.end("Hello qinhuansky")
  } else if(request.url == "/home"){
    response.end('wellcome home')
  }else{
    response.end('404')
  }
}); 
http.createServer(app).listen(3800);  

