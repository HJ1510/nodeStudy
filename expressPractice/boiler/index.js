const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/keys');
const { auth } = require('./middleware/auth');
const { User } = require('./models/User');

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// application/json
app.use(bodyParser.json());

app.use(cookieParser());

const mongoose = require('mongoose');
mongoose
  .connect(config.mongoURI)
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!!!!');
});

app.post('/api/users/register', (req, res) => {
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

app.post('/api/users/login', (req, res) => {
  User.findOne({ email: req.body.email })
    // 1. 요청된 이메일을 데이터베이스에서 찾음
    // findOne() mongodb 지원
    .then((user) => {
      if (!user) {
        return res.json({
          loginSuccess: false,
          message: '이메일에 해당하는 사용자가 없습니다',
        });
      }
      console.log(user);
      // 2. 이메일이 있다면 비밀번호가 일치하는지 검토
      user.comparePassword(req.body.password, (err, isMatch) => {
        // 메소드는 user 모델에서 생성
        if (!isMatch)
          // 비밀번호가 안맞을때
          return res.json({
            loginSuccess: false,
            message: '비밀번호가 틀렸습니다',
          });
        user.generateToken((err, user) => {
          if (err) return res.status(400).send(err);
          // 토큰을 저장 => 쿠키, 로컬스토리지 등등.. 저장 가능한 곳은 여러곳임
          // 여기선 쿠키 사용
          res
            .cookie('x_auth', user.token)
            .status(200)
            .json({ loginSucess: true, userId: user._id });
        });
      });
    })
    .catch((err) => {
      return res.status(400).send(err);
    });
});

app.get('/api/users/auth', auth, (req, res) => {
  // 여기에 진입했다는 것은 auth 미들웨어를 통과해서 인증을 마쳤다는 의미
  res.status(200).json({
    _id: req.user._id, // auth에서 req.user = user; 했기때문에 가능
    isAdmin: req.user.roll === 0 ? false : true, // role = 0 일반유저 그외에는 관리자로 설정했을때
    isAuth: true,
    email: req.user.email,
    nickname: req.user.nickname,
    role: req.user.role,
    img: req.user.img,
  });
});

// // name을 기준으로 회원정보 수정
// app.put('/api/users/:name', auth, (req, res) => {
//   User.findOneAndUpdate({ name: req.params.name }, req.body, { new: true })
//     .then((user) => {
//       res.status(200).json({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         nickname: user.nickname,
//         role: user.role,
//         img: user.img,
//       });
//     })
//     .catch((err) => {
//       res.json({ success: false, err });
//     });
// });

// _id를 기준으로 회원정보수정(일반적)
// findByIdAndUpdate() mongoose 지원
// req.params.id가 string으로 넘어가도 Mongoose에서 자동으로 ObjectId로 변환하여 DB에서 검색
app.put('/api/users/:id', auth, (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((user) => {
      res.status(200).json({
        _id: user._id,
        isAdmin: user.role === 0 ? false : true,
        isAuth: true,
        email: user.email,
        nickname: user.nickname,
        role: user.role,
        img: user.img,
      });
    })
    .catch((err) => {
      res.json({ success: false, err });
    });
});

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: '' }) // auth에서 req.user = user; 했기때문에 가능
    .then(() => {
      return res.status(200).send({ success: true });
    })
    .catch((err) => {
      return res.json({ success: false, err });
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
