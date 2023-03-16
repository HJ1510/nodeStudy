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
