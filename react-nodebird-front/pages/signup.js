import React, { useState, useCallback, useEffect } from 'react';
import Router from 'next/router';
import Head from 'next/head';
import { Form, Input, Checkbox, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { END } from 'redux-saga';

import AppLayout from '../components/AppLayout';
import useInput from '../hooks/useInput';
import { SIGN_UP_REQUEST, LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';

const Signup = () => {
  const dispatch = useDispatch();
  const { signUpLoading, signUpDone, signUpError, me } = useSelector(
    (state) => state.user,
  );

  const [passwordCheck, setPasswordCheck] = useState('');
  const [term, setTerm] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [termError, setTermError] = useState(false);

  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangenicknamename] = useInput('');
  const [password, onChangePassword] = useInput('');

  useEffect(() => {
    if (me && me.id) {
      Router.replace('/');
    }
  }, [me && me.id]);

  useEffect(() => {
    if (signUpDone) {
      alert('가입에 성공하셨습니다.');
      Router.push('/');
    }
  }, [signUpDone]);

  useEffect(() => {
    if (signUpError) {
      alert(signUpError);
    }
  }, [signUpError]);

  const onFinish = useCallback(() => {
    if (!term) {
      return setTermError(true);
    }
    if (password !== passwordCheck || password.length < 8) {
      return setPasswordError(true);
    }
    return dispatch({
      type: SIGN_UP_REQUEST,
      data: { email, password, nickname },
    });
  }, [email, password, passwordCheck, term]);

  const onChangePasswordCheck = useCallback((e) => {
    setPasswordError(false);
    setPasswordCheck(e.target.value);
  }, []);

  const onChangeTerm = useCallback((e) => {
    setTermError(false);
    setTerm(e.target.checked);
  }, []);

  return (
    <AppLayout>
      <Head>
        <title>회원가입 | NodeBird</title>
      </Head>
      <h1 style={{ padding: 10 }}>회원가입</h1>
      <Form onFinish={onFinish} style={{ padding: 10 }}>
        <div>
          <label htmlFor="user-email">이메일</label>
          <br />
          <Input
            name="user-email"
            value={email}
            required
            onChange={onChangeEmail}
            type="email"
            style={{ width: 300 }}
          />
        </div>
        <div>
          <label htmlFor="user-nickname">닉네임(20자 이하)</label>
          <br />
          <Input
            name="user-nickname"
            value={nickname}
            required
            onChange={onChangenicknamename}
            style={{ width: 200 }}
          />
        </div>
        <div>
          <label htmlFor="user-password">비밀번호(8자 이상)</label>
          <br />
          <Input
            name="user-password"
            type="password"
            value={password}
            required
            onChange={onChangePassword}
            style={{ width: 200 }}
          />
        </div>
        <div>
          <label htmlFor="user-password-check">비밀번호체크</label>
          <br />
          <Input
            name="user-password-check"
            type="password"
            value={passwordCheck}
            required
            onChange={onChangePasswordCheck}
            style={{ width: 200 }}
          />
          {passwordError && (
            <div style={{ color: 'red' }}>
              비밀번호가 일치하지 않거나 형식에 맞지 않습니다.
            </div>
          )}
        </div>
        <div>
          <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>
            약관에 동의합니다.
          </Checkbox>
          {termError && (
            <div style={{ color: 'red' }}>약관에 동의하셔야 합니다.</div>
          )}
        </div>
        <div style={{ marginTop: 10 }}>
          <Button type="primary" htmlType="submit" loading={signUpLoading}>
            가입하기
          </Button>
        </div>
      </Form>
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }
    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  },
);

export default Signup;
