## MongoDB
https://mongodb.com/
회원가입 후 
cluster 생성 
connect하면서 user 생성 ( 이 때 정보 다 기억해 둬야함. **Add your connection string into your application code** 이 코드도 필요)

### mongoose 패키지 필요
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

#### mongoDB 스키마 설정
별도의 파일로 관리
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
