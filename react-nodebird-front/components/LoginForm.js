import React, { useCallback, useEffect } from 'react';
import { Form, Input, Button, Divider } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import KakaoLogin from 'react-kakao-login';
import GoogleLogin from 'react-google-login';
import styled from 'styled-components';

import useInput from '../hooks/useInput';
import { LOG_IN_REQUEST } from '../reducers/user';

const LoginForm = () => {
  const dispatch = useDispatch();
  const { logInLoading, logInError } = useSelector((state) => state.user);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');

  const onSubmitForm = useCallback(() => {
    dispatch({
      type: LOG_IN_REQUEST,
      data: { email, password, provider: 'local' },
    });
  }, [email, password]);

  const onSuccessKakao = useCallback(async (res) => {
    const { id } = res.profile;
    const { profile } = res.profile.kakao_account;
    dispatch({
      type: LOG_IN_REQUEST,
      data: {
        snsId: id.toString(),
        email: id.toString().concat('@kakao.com'),
        nickname: profile.nickname,
        avatar: profile.profile_image_url,
        provider: 'kakao',
      },
    });
  });

  const onFailureKakao = useCallback((err) => {
    console.error(err);
    alert(err);
  });

  const onSuccessGoogle = useCallback(async (res) => {
    dispatch({
      type: LOG_IN_REQUEST,
      data: {
        snsId: res.Pt.getId(),
        email: res.Pt.getEmail(),
        nickname: res.Pt.getName(),
        avatar: res.Pt.getImageUrl(),
        provider: 'google',
      },
    });
  });

  const onFailureGoogle = useCallback((err) => {
    console.error(err);
    alert(err.error);
  });

  useEffect(() => {
    if (logInError) {
      alert(logInError);
    }
  }, logInError);

  return (
    <Form onFinish={onSubmitForm} style={{ padding: '20px' }}>
      <div>
        <Input
          name="user-email"
          value={email}
          onChange={onChangeEmail}
          type="email"
          placeholder="이메일"
          style={{ marginBottom: 5 }}
          required
        />
        <Input
          name="user-password"
          type="password"
          value={password}
          onChange={onChangePassword}
          placeholder="비밀번호"
          required
        />
      </div>
      <div style={{ margin: '20px 0' }}>
        <Button
          style={{ width: '100%' }}
          type="primary"
          htmlType="submit"
          loading={logInLoading}
        >
          로그인
        </Button>
      </div>
      <Divider plain>
        <span style={{ opacity: 0.8 }}>또는</span>
      </Divider>
      <div>
        <KakaoBtn
          jsKey="a3fd7530e852ab7dcbde2dc5fddaad8d"
          buttonText="Sign in with Kakao"
          onSuccess={onSuccessKakao}
          onFailure={onFailureKakao}
          getProfile={1}
        />
      </div>
      <div>
        <GoogleBtn
          clientId="922518242949-pppra1i3t25mahq4441s3r7okauo001d.apps.googleusercontent.com"
          onSuccess={onSuccessGoogle}
          onFailure={onFailureGoogle}
          cookiePolicy="single_host_origin"
        />
      </div>
    </Form>
  );
};

const KakaoBtn = styled(KakaoLogin)`
  padding: 0;
  width: 100%;
  height: 44px;
  line-height: 44px;
  color: #783c00;
  background-color: #ffeb00;
  border: 1px solid transparent;
  border-radius: 3px;
  font-size: 14px;
  text-align: center;
  cursor: pointer;
`;

const GoogleBtn = styled(GoogleLogin)`
  padding: 0;
  width: 100%;
  margin: 10px 0;
  height: 44px;
`;

export default LoginForm;
