import React, { useCallback, useEffect } from 'react';
import { Form, Input, Button, Divider, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
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

  const onSuccessKakao = useCallback((res) => {
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

  const onSuccessGoogle = useCallback((res) => {
    dispatch({
      type: LOG_IN_REQUEST,
      data: {
        snsId: res.getBasicProfile().getId(),
        email: res.getBasicProfile().getEmail(),
        nickname: res.getBasicProfile().getName(),
        avatar: res.getBasicProfile().getImageUrl(),
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
    <>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onSubmitForm}
        style={{ padding: '10px 10px 0 10px' }}
      >
        <Form.Item
          name="user-email"
          rules={[{ required: true, message: '이메일을 입력해주세요.' }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            type="email"
            placeholder="Email"
            onChange={onChangeEmail}
          />
        </Form.Item>
        <Form.Item
          name="user-password"
          rules={[{ required: true, message: '비밀번호를 입력해주세요.' }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
            onChange={onChangePassword}
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <a className="login-form-forgot" href="" style={{ float: 'right' }}>
            Forgot password
          </a>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            loading={logInLoading}
            style={{ width: '100%' }}
          >
            로그인
          </Button>
          Or <a href="/signup">register now!</a>
        </Form.Item>
      </Form>
      <Divider plain>
        <span style={{ opacity: 0.8 }}>또는</span>
      </Divider>
      <div className="login-sns" style={{ padding: '10px' }}>
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
            theme="dark"
          />
        </div>
      </div>
    </>
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
