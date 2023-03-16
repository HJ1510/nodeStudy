https://youtube.com/playlist?list=PL9a7QRYt5fqkZC9jc7jntD1WuAogjo_9T
## MongoDB
https://mongodb.com/
회원가입 후 
cluster 생성 
connect하면서 user 생성 ( 이 때 정보 다 기억해 둬야함. **Add your connection string into your application code** 이 코드도 필요)

### mongoose 패키지 필요
**findOne()도 save()와 마찬가지로 몽구스 5.0부터는 콜백함수를 지원하지 않음 코드 작성시 주의**
```
npm install mongoose 
```
#### mongoDB 연결 설정
`index.js`
```js
const express = require('express');
const app = express();
const port = 5000;

const mongoose = require('mongoose');
mongoose
  .connect(
    'mongodb+srv://usename:password@bolier.vv86dqn.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log('MongoDB Connected...')) //연결되면
  .catch((err) => console.log(err)); // 연결시도에 에러 나면

app.get('/', (req, res) => {
  res.send('Hello World!!!!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```
mongodb+srv://usename:password@bolier.vv86dqn.mongodb.net/?retryWrites=true&w=majority

error : MongoServerError: bad auth : authentication failed 
usename:password
<> 없어야 함!  유저 부분에 있을 경우 에러 생김
key값 따로 관리하는 법
https://3dpit.tistory.com/405

### 1 회원가입	
#### mongoDB 스키마 설정
별도의 파일로 관리 
**Mongoose는 기본적으로 컬렉션을 자동으로 생성하지 않습니다. 대신 Mongoose는 모델을 사용하여 데이터를 저장하거나 검색할 때 컬렉션이 존재하지 않으면 자동으로 생성**
`User.js`
```js
const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: 50,
    },
    email: {
      type: String,
      trim: true, // 스페이스(공백)을 없애줌
      maxlength: 255,
      unique: 1,
    },
    nickname: {
      type: String,
      maxlength: 50,
    },
    password: {
      type: String,
      minlength: 5,
    },
    gender: Boolean,
    role: {
      type: Number,
      default: 0,
    },
    profile_img_url: String,
    token: {
      type: String,
    },
    tokenExp: {
      type: Number,
    },
  },
  { timestamp: true }
);

const User = mongoose.model('User', userSchema);

module.exports = { User };
```

#### body-parser
```
npm install body-parser
```

#### mongoDB 모델 불러와 데이터 삽입
```js
...
const  bodyParser  =  require('body-parser');
const {User} =  require('./models/User');
...
// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// application/json
app.use(bodyParser.json()); // body-parser 이용해서 클라이언트에서 넘어오는 각 종류의 데이터 분석 가능
...
app.post('/register', (req, res) => {
  // 회원가입시 필요한 정보를 클라이언트에서 가져오고
  // 그 정보를 데이터베이스에 삽입
  const user = new User(req.body);
  // user모델에 정보가 저장되고 실패시 에러메세지 출력
  user
    .save() // 몽고db에서 지원
    .then(() => {
      res.status(200).json({
        success: true,
      });
    })
    .catch((err) => {
      return res.json({ success: false, err });
    });
});
...
```

#### postman 사용

### 2 로그인
#### Bcrypt로 비밀번호 암호화
암호화
``` 
npm install bcrypt
```
`User.js`
```js
// 
...
const bcrypt = require('bcrypt');
const saltRounds = 10; // 10자리의 salt를 생성
...
// pre() mongoose에서 지원 user.save() 전에 처리할 함수 지정
userSchema.pre('save', function (next) {
  var user = this;
  if (user.isModified('password')) {
    // isModified() mongoose 지원 파라미터 값이 바뀔 때 true 반환
    // Salt 이용 비밀번호 암호화
    bcrypt.genSalt(saltRounds, function (err, salt) {
      // genSalt : Salt 생성

      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        // user.password: 사용자가 실제 입력한 비밀번호
        // hash: 암호화된 비밀번호
        // Store hash in your password DB.
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  // plainpassword를 암호화 해서 비교해야힘
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};
...
```

#### jsonWebToken
토큰 생성 https://www.npmjs.com/package/jsonwebtoken
```
npm install jsonwebtoken
```
`User.js`
```js
...
const  jwt  =  require('jsonwebtoken');
...
userSchema.methods.generateToken = function (cb) {
  var user = this;
  // jsonwebtoken으로 토큰 생성 sign()
  var token = jwt.sign(user._id.toHexString(), 'secretToken'); // secretToken은 다른 이름이어도 됨 .toHexString()은 toString()과 비슷하게 문자열로 리턴해주는 함수
  // user._id + 'secretToken' = token
  // ->
  // 'secretToken' -> user._id
  user.token = token;
  user
    .save()
    .then(() => {
      cb(null, user);
    })
    .catch((err) => {
      return cb(err);
    });
};
...
```

#### cookie-parser
쿠키에 저장
```
npm install cookie-parser
```


로그인 구현 최종 `index.js`
```js
const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/keys');

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

app.post('/login', (req, res) => {
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

```

### 3 Auth
auth 미들웨어 사용
`auth.js`
```js
const { User } = require('../models/User');

let auth = (req, res, next) => {
  // 인증처리
  // 클라이언트 쿠키에서 토큰을 가져옴
  let token = req.cookies.x_auth;
  // 토큰을 복호화하고 유저를 찾음
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, err: true });
    req.token = token;
    req.user = user; // req에 token과 user를 넣어서 다음 단계에 전달
    next(); // 없으면 미들웨어에서 다음 단계로 전달이 안됨
  });
  // 유저가 있으면 인증ok
  // 유저가 없으면 인증no
};

module.exports = { auth };
```

`user.js`
```js
...
userSchema.statics.findByToken = function (token, cb) {
  var user = this;
  // 토큰을 decode
  jwt.verify(token, 'secretToken', function (err, decoded) {
    // 유저 아이디를 이용해서 유저 찾고
    // 클라이언트에서 가져온 token과 DB에 보관된 token을 비교
    // findOne() mongoDB지원
    user.findOne({ _id: decoded, token: token }).then((err) => {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};
...
```
`index.js`
```js
...
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
...
```

### 4 로그아웃
1) 로그아웃 하려는 유저를 데이터베이스에서 찾아서
2) 그 유저의 토큰을 지운다
=> 인증이 안되서 로그인 기능이 풀림
`index.js`
```js
app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: '' }) // auth에서 req.user = user; 했기때문에 가능
    .then(() => {
      return res.status(200).send({ success: true });
    })
    .catch((err) => {
      return res.json({ success: false, err });
    });
});
```
{ "success":  true }가 반환되고 DB를 확인해보면 해당 유저의 token값이 삭제되어있음을 알 수 있음
