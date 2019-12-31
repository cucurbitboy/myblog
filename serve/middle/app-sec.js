let express = require("express");
let fs = require("fs");
let http = require("http");
let path = require("path");
let bodyParser = require("body-parser");
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "../views"));

// cookie设置与解析
// cnpm i cookie-parser -S
// cnpm i cookie-signature -S
var cookieParser = require("cookie-parser");
var signature = require("cookie-signature");
// 初始化中间件，指定一个secret,字符串,否者会报错
// app.use(cookieParser("secrettt"));
// app.use((req, res, next) => {
//   if (req.url == "/cookie") {
//     if (!req.cookies.nick) {
//       res.cookie("nick", "qin"); //express自带api方法，express就会将其填入Response Header中的Set-Cookie，达到在浏览器中设置cookie的作用
//       res.cookie("snick", "qin", { signed: true }); //signed设置为true对cookie进行签名加密, 通过response直接设置到浏览器cookie中
//       // {options}
//       // domain：cookie在什么域名下有效，类型为String,。默认为网站域名
//       // expires: cookie过期时间，类型为Date。如果没有设置或者设置为0，那么该cookie只在这个这个session有效，即关闭浏览器后，这个cookie会被浏览器删除。
//       // httpOnly: 只能被web server访问，类型Boolean。
//       // maxAge: 实现expires的功能，设置cookie过期的时间，类型为String，指明从现在开始，多少毫秒以后，cookie到期。
//       // path: cookie在什么路径下有效，默认为'/'，类型为String
//       // secure：只能被HTTPS使用，类型Boolean，默认为false
//       // signed:使用签名，类型Boolean，默认为false。`express会使用req.secret来完成签名，需要cookie-parser配合使用`
//       // res.clearCookie(name [, options]); //express直接提供了api删除浏览器中的cookie
//       console.log(req.cookies); //{ nick: 'qin' } unsigned cookie保存在req.cookies
//       console.log(req.signedCookies); //[Object: null prototype] { snick: false } signed cookie只保存在req.signedCookies中
//     } else {
//       console.log(req.headers.cookie); //nick=qin; snick=s%3Aqin.poXxfblxvUOPCqcx07XzPtNqBu1esp%2BNfHSogg8lfc4
//       // 签名后解析
//       // let sinedvalue = signedCookie(
//       //   req.headers.cookie.split("=")[req.headers.cookie.split("=").length - 1],
//       //   "secrettt"
//       // );
//       // 待扩展
//     }
//     res.end("Hello qinhuansky");
//   } else {
//     res.end("404");
//   }
// });
// cookie设置与解析===========================================================

// 日志工具log4js，后面会说到morgan，可以选择使用
// cnpm i log4js -S
const log4js = require("log4js");
// logger.level = 'debug'; //设置等级，低于debug的将无法打印
// configure方法为配置log4js对象，内部有levels、appenders（文件输入源）、categories三个属性
log4js.configure({
  appenders: {
    allLog: {
      type: "file",
      filename: "./log/all.log",
      keepFileExt: true,
      maxLogSize: 10485760,
      backups: 3
    },
    "rule-console": {
      type: "console"
    },
    "rule-file": {
      type: "dateFile",
      filename: "log/server-",
      encoding: "utf-8",
      maxLogSize: 10000000,
      numBackups: 3,
      pattern: "yyyy-MM-dd.log",
      alwaysIncludePattern: true
    },
    "rule-http-error": {
      type: "dateFile",
      filename: "log/error-",
      encoding: "utf-8",
      maxLogSize: 10 * 1000 * 1000, //表示文件多大时才会创建下一个文件,单位是字节,不推荐大于100Mb
      numBackups: 3, //表示备份的文件数量,如果文件过多则会将最旧的删除
      pattern: "yyyy-MM-dd.log",
      alwaysIncludePattern: true // 默认ture开启pattern,false是不开启pattern,不开启时datefile文件将无任何时间后缀,也不会分文件
    }
  },
  categories: {
    default: {
      appenders: ["allLog", "rule-console", "rule-file", "rule-http-error"],
      level: "debug"
    },
    http: {
      appenders: ["rule-console"],
      level: "info"
    }
  }
});
//getLogger参数取categories项,为空或者其他值取default默认项
const logger = log4js.getLogger();
const httpLog = log4js.getLogger("http");
// 一下级别由低到高，只有大于等于日志配置级别的信息才能输出出来，可以通过category来有效的控制日志输出级别
// logger.trace("Entering testing");
// logger.debug("Got access.");
// logger.info("access is Comté.");
// logger.warn("access is quite smelly.");
// logger.error("access is too ripe!");
// logger.fatal("access was breeding ground for listeria.");
httpLog.info("我能打印出来");
httpLog.debug("我低于设定info级别，打印不出来");
// [2019-12-26T13:17:02.443] [INFO] http - 我能打印出来
// https://github.com/log4js-node/log4js-node
// 日志工具log4js=================================================================

// crypto模块之理论篇
// 摘要（digest）：将长度不固定的消息作为输入，通过运行hash函数，生成固定长度的输出，这段输出就叫做摘要。通常用来验证消息完整、未被篡改,摘要运算是不可逆的。常见摘要算法：MD5：128位、SHA-1：160位、SHA256 ：256位、SHA512：512位
var crypto = require("crypto");
var md5 = crypto.createHash("md5");
var message = "hello";
var digest = md5.update(message, "utf8").digest("hex");
console.log(digest); //5d41402abc4b2a76b9719d911017c592
// HMAC（Hash-based Message Authentication Code）：消息认证码,可以粗略地理解为带秘钥的hash函数。
// 带秘钥秘钥
let hmac = crypto.createHmac("md5", "123456");
let ret = hmac.update("hello").digest("hex");
console.log(ret); //9c699d7af73a49247a239cb0dd2f8139
// 加密/解密：给定明文，通过一定的算法，产生加密后的密文，这个过程叫加密。反过来就是解密。
// 根据加密、解密所用的秘钥是否相同，可以将加密算法分为对称加密(DES、3DES、AES、Blowfish、RC5、IDEA)、非对称加密(RSA、DSA、ElGamal)。
// 1,对称加密速度要快于非对称加密。
// 2,非对称加密通常用于加密短文本，对称加密通常用于加密长文本
// crypto模块之理论篇=================================================================

// nodejs的核心模块，基本上都是stream的的实例
// way 一
// fs.readFile("../text.txt", "utf8", function(err, content) {
//   console.log("文件读取完成，文件内容是 [%s]", content);
// });
// way 二
// var readStream = fs.createReadStream("../text.txt");
// var content = "";
// readStream.setEncoding("utf8");
// readStream.on("data", function(chunk) {
//   content += chunk;
// });
// readStream.on("end", function(chunk) {
//   console.log("文件读取完成，文件内容是 [%s]", content);
// });
// way 三 大文件流
// var filepath = "../text.txt";
// // 写入
// var contentText = "hello world";
// var writeStram = fs.createWriteStream(filepath);
// writeStram.write(contentText);
// writeStram.end();
// // 读出
// let fileStream = fs.createReadStream(filepath);
// fileStream.pipe(process.stdout);
// fileStream.on("data", endFun);
// function endFun() {
//   process.stdout.write("]");
// }
// process.stdout.write("文件内容: [");

// 长轮询：是对定时轮询的改进和提高，目地是为了降低无效的网络传输。当服务器端没有数据更新的时候，连接会保持一段时间周期直到数据或状态改变或者 时间过期，少无效的客户端和服务器间的交互
// 流：客户端的页面使用一个隐藏的窗口向服务端发出一个长连接的请求。服务器端接到这个请求后作出回应并不断更新连接状态以保证客户端和服务 器端的连接不过期
// WebSocket 协议本质上是一个基于 TCP 的协议。（客户端的Sec-WebSocket-Key和服务器端的Sec-WebSocket-Accept握手认证信息）
// Duplex stream net.Socket实例
// ================================================================
// 服务端
// cnpm install nodejs-websocket --save
// var ws = require("nodejs-websocket");
// console.log("开始建立连接...");
// var server = ws
//   .createServer(function(conn) {
//     conn.on("binary", function(inStream) {
//       // 创建空的buffer对象，收集二进制数据
//       var data = new Buffer(0);
//       // 读取二进制数据的内容并且添加到buffer中
//       inStream.on("readable", function() {
//         var newData = inStream.read();
//         if (newData)
//           data = Buffer.concat([data, newData], data.length + newData.length);
//       });
//       inStream.on("end", function() {
//         // 读取完成二进制数据后，处理二进制数据
//       });
//     });
//     conn.on("text", function(result) {
//       console.log("收到的信息为:" + result);
//       conn.sendText(result, () => {
//         console.log("成功发送");
//       });
//       // connection.send(data, [callback])包含sendText发文本 ,sendBinary发二进制
//     });
//     // 建立新链接（完成握手后）触发，conn 是连接的实例对象
//     conn.on("connect", function(code) {
//       console.log("开启连接", code);
//     });
//     // 当服务关闭时触发该事件，如果有任何一个 connection 保持链接，都不会触发该事件
//     conn.on("close", function(code, reason) {
//       console.log("关闭连接");
//     });
//     conn.on("error", function(code, reason) {
//       console.log("异常关闭");
//     });
//   })
//   .listen(3800);
// console.log("WebSocket建立完毕");
// 开始建立连接...
// WebSocket建立完毕
// 收到的信息为:连上了……
// 收到的信息为:Tue Dec 31 2019 15:40:29 GMT+0800 (中国标准时间)可以对话了……
// 客户端
/* <script>
    if(window.WebSocket){
        var ws = new WebSocket('ws://127.0.0.1:3800');
        ws.onopen = function(e){
          console.log("连接服务器成功");
          ws.send("连上了……");
        }
        ws.onclose = function(e){
          console.log("服务器关闭");
        }
        ws.onerror = function(){
          console.log("连接出错");
        }
        ws.onmessage = function(e){
          var time = new Date();
          // ws.send(time + "连接中……");
          document.getElementById("mess").onclick = function(){
            ws.send(time + "可以对话了……");
          }
        }
    }
</script> */

// 获取文件扩展名
var filepath = "/tmp/demo/js/test.js";
// 输出：/tmp/demo/js
console.log(path.dirname(filepath));
// 输出：.js
console.log(path.extname(filepath));
// 输出：test.js
console.log(path.basename(filepath));
// 输出：test
console.log(path.basename(filepath, ".js"));
// ==================================================================================
// 文件逐行读取：比如说进行日志分析。
// 自动完成：比如输入npm，自动提示"help init install"。
// 命令行工具：比如npm init这种问答式的脚手架工具
// const readline = require("readline");
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });
// rl.question("Please input a word: ", function(answer) {
//   console.log("You have entered [%s]", answer.toUpperCase());
//   rl.close();
// });
// =====================================================================================
// process是node的全局模块，作用比较直观。可以通过它来获得node进程相关的信息
// 环境变量：process.env
// 异步：process.nextTick(fn)
// 获取命令行参数：process.argv
process.argv.forEach(function(val, index, array) {
  console.log("参数" + index + ": " + val);
});
// 获取node specific参数：process.execArgv
http.createServer(app).listen(3800);
