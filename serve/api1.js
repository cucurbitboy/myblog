var express = require("express");
// 使用 Router 中间件来实现 API 版本管理
var api = express.Router();

api.get("/versonapi", function(req, res) {
  res.send("verson one");
});
api.get("/all_timezones", function(req, res) {
  res.send("Sample response for /all_timezones");
});

module.exports = api;
