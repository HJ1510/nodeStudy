const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 5000;
const { User } = require('./models/User');

const config = require('./config/keys');

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// application/json
app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose
  .connect(config.mongoURI)
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!!!!');
});

app.post('/register', (req, res) => {
  // 회원가입시 필요한 정보를 클라이언트에서 가져오고
  // 그 정보를 데이터베이스에 삽입
  const user = new User(req.body);
  // user모델에 정보가 저장되고 실패시 에러메세지 출력
  user
    .save()
    .then(() => {
      res.status(200).json({
        success: true,
      });
    })
    .catch((err) => {
      return res.json({ success: false, err });
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
