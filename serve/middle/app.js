let express = require("express");
let http = require("http");
var app = express();
let path = require("path");
let bodyParser = require("body-parser");
// 告诉 Express 你将使用EJS模板引擎
app.set("view engine", "ejs");
// 告诉 Express 你的视图存在于一个名为 views 的文件夹中
app.set("views", path.resolve(__dirname, "../views"));
//创建application/json解析
app.use(bodyParser.json());
// 创建 application/x-www-form-urlencoded 编码解析
app.use(bodyParser.urlencoded({ extended: false }));

// cdn测试
// var dns = require("dns");
// var options = { all: true };
// dns.lookup("www.qinhuansky.top", options, function(err, address, family) {
//   if (err) throw err;
//   console.log(address); //[ { address: '122.51.198.35', family: 4 } ]
// });
// dns.resolve4("www.qinhuansky.top", function(err, address) {
//   if (err) throw err;
//   console.log(JSON.stringify(address)); //["122.51.198.35"]
// });
// cdn测试===================================

// 集群:node实例是单线程作业的。在服务端编程中，通常会创建多个node实例来处理客户端的请求，以此提升系统的吞吐率。对这样多个node实例，我们称之为cluster（集群）。
// var cluster = require("cluster"); //在cluster模块中，主进程称为master，子进程称为worker。
// var cpuNums = require("os").cpus().length; //创建与CPU数目相同的服务端实例
// console.log(cpuNums);
// if (cluster.isMaster) {
//   for (var i = 0; i < cpuNums; i++) {
//     cluster.fork(); //创建 worker进程
//   }
// } else {
//   http
//     .createServer(function(req, res) {
//       res.end(`response from worker ${process.pid}`);
//     })
//     .listen(3000);
//   console.log(`Worker ${process.pid} started`);
// }
// 集群===================================

// 字符编解码:网络通信的过程中，传输的都是二进制的比特位，客户端编码，将需要传送的数据，转成对应的二进制比特位；服务端解码，将二进制比特位，转成原始的数据（字符<->二进制的相互转换）
// var iconv = require("iconv-lite");
// var oriText = "你";
// var encodedBuff = iconv.encode(oriText, "gbk");
// console.log(encodedBuff);
// // <Buffer c4 e3>
// var decodedText = iconv.decode(encodedBuff, "gbk");
// console.log(decodedText); //相同字符集解码
// // 你
// var wrongText = iconv.decode(encodedBuff, "utf8");
// console.log(wrongText);
// // ��
// 字符编解码===================================

// MD5：散列函数（又称哈希算法、摘要算法）主要用来确保消息的完整和一致性。常见的应用场景有密码保护、下载文件校验等
// MD5密码是不可逆的，防止内部存铭文密码。但相同的明文密码，md5值也是相同的。如果事先将常见明文密码的md5值运算好存起来，然后跟网站数据库里存储的密码进行匹配，就能够快速找到用户的明文密码（彩虹表）
// 方案：密码加盐。就是在密码特定位置插入特定字符串后，再对修改后的字符串进行md5运算
// var crypto = require("crypto"); //crypto模块封装了一系列密码学相关的功能，包含md5
// //生成随机盐
// function getRandomSalt() {
//   return Math.random()
//     .toString()
//     .slice(2, 5);
// }

// function cryptPwd(password, salt) {
//   var saltPassword = password + ":" + salt;
//   console.log("原始密码：%s", password);
//   console.log("加盐后的密码：%s", saltPassword);
//   // 加盐密码的md5值
//   var md5 = crypto.createHash("md5");
//   var result = md5.update(saltPassword).digest("hex");
//   console.log("加盐密码的md5值：%s", result);
// }
// var password = "123456";
// cryptPwd("123456", getRandomSalt());
// 原始密码：123456
// 加盐后的密码：123456:409
// 加盐密码的md5值：69c9c2c61e6e605a43450a643a91543b
// MD5碰撞：相同MD5值，原值不同===================================

// 图片上传
// cnpm i multer --save
var fs = require("fs");
var multer = require("multer");
let qiniu = require("qiniu");
// 空间名
var bucket = "qinhuansky";
// 方式一：默认文件名
// var upload = multer({ dest: "upload/" }); //上传到当前目录的upload下，没有自动创建
// 方式二：自定义文件
var createFolder = function(folder) {
  try {
    fs.accessSync(folder);
  } catch (e) {
    fs.mkdirSync(folder);
  }
};
var uploadFolder = "./upload/";
createFolder(uploadFolder);
// 通过 filename 属性定制
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadFolder); // 保存的路径，备注：需要自己创建
  },
  filename: function(req, file, cb) {
    // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
    cb(null, file.fieldname + "-" + Date.now());
  }
});
// 通过 storage 选项来对 上传行为 进行定制化
var upload = multer({ storage: storage });
// 单图上传;upload.array('logo', 2)表示多图上传
app.post("/upload", upload.single("logo"), function(req, res, next) {
  var file = req.file;
  console.log("文件类型：%s", file.mimetype);
  console.log("原始文件名：%s", file.originalname);
  console.log("文件大小：%s", file.size);
  console.log("文件保存路径：%s", file.path); //文件保存路径：upload\logo-1577165939230
  // 获取存的upload下的二进制文件，转base64
  var bData = fs.readFileSync("./upload/logo-1577165939230");
  var base64Str = bData.toString("base64");
  var datauri = "data:image/png;base64," + base64Str;
  console.log(datauri);

  res.send({ ret_code: "0", data: datauri });
});

app.get("/form", function(req, res, next) {
  var form = fs.readFileSync("../middle-view/bodyParser.html", {
    encoding: "utf8"
  });
  res.send(form);
});
// 图片上传===================================

// session相关配置
// npm install --save express-session session-file-store
var session = require("express-session");
var FileStore = require("session-file-store")(session);
var identityKey = "skey";
app.use(
  session({
    name: identityKey,
    secret: "qin", // 用来对session id相关的cookie进行签名
    store: new FileStore(), // 本地存储session（文本文件，也可以选择其他store，比如redis的）
    saveUninitialized: false, // 是否自动保存未初始化的会话，建议false
    resave: false, // 是否每次都重新保存会话，建议false
    cookie: {
      maxAge: 1800 * 1000 // 有效期，单位是毫秒
    }
  })
);
// 登录登出----------------------------------------------------

// 登录接口
app.post("/login", function(req, res, next) {
  var sess = req.session;
  console.log(req.body);
  if (req.body.name == "qin" && req.body.password == "123456") {
    // 如果用户存在，则通过req.regenerate创建session，保存到本地
    req.session.regenerate(function(err) {
      if (err) {
        return res.json({ ret_code: 2, ret_msg: "登录失败" });
      }
      req.session.loginUser = req.body.name;
      res.json({ ret_code: 0, ret_msg: "登录成功" });
    });
  } else {
    res.json({ ret_code: 1, ret_msg: "账号或密码错误" });
  }
});

// 退出登录
app.get("/logout", function(req, res, next) {
  // 备注：这里用的 session-file-store 在destroy 方法里，并没有销毁cookie
  // 所以客户端的 cookie 还是存在，导致的问题 --> 退出登陆后，服务端检测到cookie
  // 然后去查找对应的 session 文件，报错
  // session-file-store 本身的bug
  req.session.destroy(function(err) {
    if (err) {
      res.json({ ret_code: 2, ret_msg: "退出登录失败" });
      return;
    }
    // req.session.loginUser = null;
    res.clearCookie(identityKey);
    res.redirect("/");
  });
});
// 检测登录与否
app.get("/", function(req, res, next) {
  var sess = req.session;
  var loginUser = sess.loginUser;
  var isLogined = !!loginUser;
  console.log(sess);
  res.render("index", {
    isLogined: isLogined,
    name: loginUser || ""
  });
});

// app.use(function(request, response) {
//   if (request.url == "/") {
//     response.end("Hello qinhuansky");
//   } else if (request.url == "/home") {
//     response.end("wellcome home");
//   } else {
//     response.end("404");
//   }
// });
http.createServer(app).listen(3800);
