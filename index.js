const express = require('express');
const cors = require('cors');
const helmet = require('helmet')
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const db = require('./database/database');
// 导入路由
const UserRoute = require('./Router/UserRouter.js');


// 环境配置
dotenv.config();

// 创建app实例
const app = express();

// CORS配置
const allowedOrigins = ['http://127.0.0.1', 'http://127.0.0.0', 'http://localhost', 'null'];
app.use(
  cors({
    methods: "*",
    // origin: (origin, callback) => {
    //   if (allowedOrigins.includes(origin)) {
    //     callback(null, true);
    //   } else {
    //     console.log(origin)
    //     callback(new Error('Not allowed by CORS'));
    //   }
    // },
    origin: true,
    credentials: true,
  })
);

app.use(helmet());

// 此处解析body，可以限制body大小
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 链接mysql数据库
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('成功链接mysql数据库');
});

// 测试
app.get("/", function (req, res) {
  res.send({ status: "success" })
});

// 路由初始化
app.use('/user', UserRoute)


app.listen(3000, () => {
  console.log('Server running on port 3000');
});