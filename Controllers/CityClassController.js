const db = require('../database/database');
const axios = require('axios');
const md5 = require('md5');

// 获取一个新的时间对象
const generateDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const seconds = String(currentDate.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 城市课堂发送邮件
const sendEmail = (email) => {
  const apiKey = 'adbba4fb4ecf6f88d91f84e662bde57d-us12';
  const listId = '446dcb726c';
  const memberId = md5(email.toLowerCase());
  const dataCenter = apiKey.split('-')[1];
  const choose = "CityClass_accept";

  const url = `https://${dataCenter}.api.mailchimp.com/3.0/lists/${listId}/members/${memberId}`;
  const url_event = `https://us12.api.mailchimp.com/3.0/lists/${listId}/members/${memberId}/events`;
  const wx_url = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=c67b1864-8ad7-4b7a-97e7-1dc59a508dc3';

  const data = {
    email_address: email,
    status: 'subscribed',
    merge_fields: {
      CHANGED: new Date().toISOString()
    }
  };
  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `user ${apiKey}`
    }
  };
  axios.put(url, data, options)
    .then(response => {
      const event_data = {
        name: choose
      };
      return axios.post(url_event, event_data, options);
    })
    .then(response => {
      const postData = {
        msgtype: 'markdown',
        markdown: {
          content: `# <font color="info">城市课堂审核无问题</font>\n >郵箱: <font color="info">${email}</font>\n >觸發事件: <font color="info">${choose}</font>\n >創建時間: <font color="info">${generateDate()}</font>`
        }
      };

      return axios.post(wx_url, postData, options);
    })
    .then(res => console.log(res.data))
    .catch(err => {
      console.error("error");
      const postData = {
        msgtype: 'markdown',
        markdown: {
          content: `# <font color="warning">城市课堂用户审核出错</font>\n >郵箱: <font color="info">${email}</font>\n >觸發事件: <font color="info">${choose}</font>\n >創建時間: <font color="info">${generateDate()}</font>`
        }
      };
      axios.post(wx_url, postData, options);
    });
}

// 城市课堂注册
const register = (req, res) => {

  const { cityClassId, utm_source, email, phone, job, company, industry, name, city } = req.body;
  const state = 0, registerTime = generateDate();

  const query = 'INSERT INTO pre_common_cityclass_register (cityClassId, utm_source, email, phone, job, company, industry, name, city, registerTime, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [cityClassId, utm_source, email, phone, job, company, industry, name, city, registerTime, state], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
    console.log('注册入库成功');
    sendEmail(email);
    res.status(200).json({ success: true, message: 'success' });
  });
}

// 城市课堂取消注册
const deregister = (req, res) => {
  const { cityClassId, phone } = req.body;
  const query = 'update pre_common_cityclass_register set state = ? where phone = ? and cityClassId = ?';
  db.query(query, [3, phone, cityClassId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
    console.log('取消注册成功');
    res.status(200).json({ success: true, message: 'success' });
  });
}

// 城市课堂联系我们
const contactUs = (req, res) => {
  const { email, name, content, classId } = req.body;
  const time = generateDate();
  const url = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=c67b1864-8ad7-4b7a-97e7-1dc59a508dc3';

  const postData = JSON.stringify({
    msgtype: 'markdown',
    markdown: {
      content: `# <font color="warning">來自城市課堂 ${classId} 的用户问题</font>\n 郵箱：<font color="info">${email}</font> \n 姓名：<font color="info">${name}</font> \n 問題內容: <font color="info">${content}</font>  \n 創建時間：<font color="comment">${time}</font>`,
    },
  });

  const options = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  axios.post(url, postData, options)
    .then(response => console.log(response.data))
    .catch(error => console.error(error));
}

module.exports = { register, deregister, contactUs };
