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
