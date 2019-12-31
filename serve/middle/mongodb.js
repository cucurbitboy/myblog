// npm install mongoose --save

var mongoose = require("mongoose");
var express = require("express");
var app = express();

app.listen(3800, function() {
  console.log("App started on port 3800");
});
//该地址格式：mongodb://[username:password@]host:port/database[?options]
//默认port为27017
mongoose.connect(
  "mongodb://localhost/config",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  },
  function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("succees");
    }
  }
);
var db = mongoose.connection;

app.use((req, res) => {
  if (req.url == "/") {
    res.end("Hello!");
  }
});
// const MongoClient = require("mongodb").MongoClient;

// const url = "mongodb://localhost:27017";
// const dbName = "express-project";

// // 连接数据库
// MongoClient.connect(
//   url,
//   {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false
//   },
//   (err, client) => {
//     if (err) throw err;
//     console.log("数据库已连接");
//     const db = client.db(dbName);
//     // 创建集合
//     db.createCollection("user", (err, res) => {
//       if (err) throw err;
//       console.log("成功创建集合");
//     });
//     db.createCollection("alias", (err, res) => {
//       if (err) throw err;
//       console.log("成功创建集合");
//     });
//     // ----------------------插入一条数据
//     let user = db.collection("user");
//     let alias = db.collection("alias");
//     let myInfo = { name: "贾克斯", age: 18 };
//     user.insertOne(myInfo, (err, res) => {
//       if (err) throw err;
//       console.log("成功插入一条数据");
//     });
//     alias.insertOne({ _id: 1 }, (err, res) => {
//       if (err) throw err;
//       console.log("成功插入一条数据");
//     });

//     // ----------------------插入多条数据, insertMany()
//     let myFriends = [
//       { name: "菲奥娜", age: 20 },
//       { name: "杰斯", age: 19 },
//       { name: "弗拉基米尔", age: 25 }
//     ];
//     user.insertMany(myFriends, (err, res) => {
//       if (err) throw err;
//       console.log(`成功插入${res.insertedCount}条数据!`);
//     });

//     // ----------------------查询数据, find(condition)
//     user.find({ name: "贾克斯" }).toArray((err, docs) => {
//       console.log("有如下数据：");
//       console.log(docs);
//     });

//     // ----------------------多表联查，左连接查询
//     user
//       .aggregate([
//         {
//           $lookup: {
//             from: "alias", //左查询集合
//             localField: "alias_id", // 本地字段
//             foreignField: "_id", // 对应本地字段的左查询集合字段
//             as: "userlist"
//           }
//         }
//       ])
//       .toArray((err, docs) => {
//         if (err) throw err;
//         var jsonDoc = JSON.stringify(docs);
//         console.log(jsonDoc);
//       });

//     // ----------------------更新单条数据
//     alias.updateOne({ _id: 1 }, { $set: { alias: "武器大师" } }, (err, res) => {
//       if (err) throw err;
//       console.log("文档更新成功");
//     });

//     // ----------------------更新多条数据
//     user.updateMany(
//       { age: 18 },
//       { $set: { relationship: "opponent" } },
//       (err, res) => {
//         if (err) throw err;
//         console.log(`${res.result.nModified}条文档被更新了`);
//       }
//     );

//     // ----------------------删除单条数据
//     user.deleteOne({ name: "杰斯" }, (err, res) => {
//       if (err) throw err;
//       console.log(`已删除`);
//     });

//     // ----------------------删除多条数据
//     user.deleteMany({ age: 18 }, (err, res) => {
//       if (err) throw err;
//       console.log("已删除");
//     });

//     // ----------------------删除一个集合
//     user.drop((err, res) => {
//       if (err) throw err;
//       console.log("已删除集合");
//       client.close();
//     });
//   }
// );
