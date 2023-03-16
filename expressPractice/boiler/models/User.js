const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; // 10자리의 salt를 생성
const jwt = require('jsonwebtoken');

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
    img: String,
    token: {
      type: String,
    },
    tokenExp: {
      type: Number,
    },
  },
  { timestamp: true }
);

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

userSchema.methods.generateToken = function (cb) {
  var user = this;
  // jsonwebtoken으로 토큰 생성 sign()
  var token = jwt.sign(user._id.toString(), 'secretToken'); // secretToken은 다른 이름이어도 됨
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

userSchema.statics.findByToken = function (token, cb) {
  var user = this;
  // 토큰을 decode
  jwt.verify(token, 'secretToken', function (err, decoded) {
    // 유저 아이디를 이용해서 유저 찾고
    // 클라이언트에서 가져온 token과 DB에 보관된 token을 비교
    // findOne() mongoDB지원
    user
      .findOne({ _id: decoded, token: token })
      .then((user) => {
        if (!user) return Promise.reject('유저를 찾을 수 없습니다.');
        return Promise.resolve(user);
      })
      .then((user) => {
        cb(null, user);
      })
      .catch((err) => {
        cb(err);
      });
  });
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
