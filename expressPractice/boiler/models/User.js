const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; // 10자리의 salt를 생성

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

const User = mongoose.model('User', userSchema);

module.exports = { User };
