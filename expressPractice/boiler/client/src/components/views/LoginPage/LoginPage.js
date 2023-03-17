import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';

function LoginPage() {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onEmailHandler = (e) => {
    setEmail(e.currentTarget.value);
  };

  const onPasswordHandler = (e) => {
    setPassword(e.currentTarget.value);
  };

  const onSubmithandler = (e) => {
    e.preventDefault();

    let body = {
      email: email,
      password: password,
    };

    axios.post('/api/users/login', body).then((res) => res.data.loginSuccess);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <form
        style={{ display: 'flex', flexDirection: 'column' }}
        onSubmit={onSubmithandler}
      >
        <lable>email</lable>
        <input type='email' value={email} onChange={onEmailHandler} />
        <lable>password</lable>
        <input type='password' value={password} onChange={onPasswordHandler} />
        <br />
        <button type='submit'>login</button>
      </form>
    </div>
  );
}

export default LoginPage;
