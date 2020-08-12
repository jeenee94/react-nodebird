import React, { useCallback, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import KakaoLogin from 'react-kakao-login';
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

  useEffect(() => {
    if (logInError) {
      alert(logInError);
    }
  }, logInError);

  return (
    <Form onFinish={onSubmitForm} style={{ padding: '10px' }}>
      <div>
        <label htmlFor="user-email">이메일</label>
        <br />
        <Input
          name="user-email"
          value={email}
          onChange={onChangeEmail}
          type="email"
          required
        />
      </div>
      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br />
        <Input
          name="user-password"
          type="password"
          value={password}
          onChange={onChangePassword}
          required
        />
      </div>
      <div style={{ marginTop: '10px' }}>
        <Button type="primary" htmlType="submit" loading={logInLoading}>
          로그인
        </Button>
        <Link href="/signup">
          <a href="/#">
            <Button>회원가입</Button>
          </a>
        </Link>
      </div>
      <div style={{ margin: 20 }}>
        <KakaoBtn
          jsKey="a3fd7530e852ab7dcbde2dc5fddaad8d"
          buttonText="Kakao"
          onSuccess={onSuccessKakao}
          onFailure={onFailureKakao}
          getProfile={1}
        />
      </div>
    </Form>
  );
};

const KakaoBtn = styled(KakaoLogin)`
  padding: 0;
  width: 190px;
  height: 44px;
  line-height: 44px;
  color: #783c00;
  background-color: #ffeb00;
  border: 1px solid transparent;
  border-radius: 3px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  &:hover {
    box-shadow: 0 0px 15px 0 rgba(0, 0, 0, 0.2);
  }
`;

export default LoginForm;
