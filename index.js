const express = require('express');
const cors = require('cors');
const helmet = require('helmet')
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const db = require('./database/database');
// 导入路由
const UserRoute = require('./Router/UserRouter.js');
const CityClassRoute = require('./Router/CityClassRouter.js');



// 环境配置
dotenv.config();

// 创建app实例
const app = express();

// CORS配置
const allowedOrigins = ['http://192.168.56.1','http://127.0.0.1', 'http://127.0.0.1:7890','http://127.0.0.0', 'http://localhost'];
app.use(
  cors({
    methods: "*",
    //origin: (origin, callback) => {
    //   if (allowedOrigins.includes(origin)) {
    //     callback(null, true);
    //   } else {
    //     console.log(origin)
    //     callback(new Error('Not allowed by CORS'));
     //  }
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
  res.send({ status: "test8" })
});

// 路由初始化
app.use('/user', UserRoute)
app.use('/cityclass', CityClassRoute)

const PORT_NUM = process.env.PORT || 8123;
app.listen(PORT_NUM, () => {
  console.log('Server running on port ' + PORT_NUM);
});
