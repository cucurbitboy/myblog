// var express = require("express");
// var app = express();

// app.get("/random/:min/:max", function(req, res) {
//   var min = parseInt(req.params.min);
//   var max = parseInt(req.params.max);
//   if (isNaN(min) || isNaN(max)) {
//     res.status(400);
//     res.json({ error: "Bad request." });
//     return;
//   }

//   var result = Math.round(Math.random() * (max - min) + min);
//   res.json({ result: result });
// });

// app.listen(3800, function() {
//   console.log("App started on port 3800");
// });

// api 通过v1,v2进行版本控制
var express = require("express");
// 引入 Router 中间件并进行路由映射
var apiVersion1 = require("./api1.js");
var apiVersion2 = require("./api2.js");
var app = express();

app.use("/v1", apiVersion1);
app.use("/v2", apiVersion2);
app.listen(3800, function() {
  console.log("App started on port 3800");
});
