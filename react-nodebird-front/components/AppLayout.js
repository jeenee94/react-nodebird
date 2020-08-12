import React, { useCallback } from 'react';
import Proptypes from 'prop-types';
import Link from 'next/link';
import { Menu, Input, Row, Col } from 'antd';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Router from 'next/router';

import LoginForm from './LoginForm';
import UserProfile from './UserProfile';
import useInput from '../hooks/useInput';

const SearchInput = styled(Input.Search)`
  vertical-align: middle;
`;

const AppLayout = ({ children }) => {
  const { me } = useSelector((state) => state.user);
  const [searchInput, onChangeSearchInput, setSearchInput] = useInput('');

  const onSearch = useCallback(() => {
    Router.push(`/hashtag/${searchInput}`);
    setSearchInput('');
  }, [searchInput]);

  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item key="home">
          <Link href="/">
            <a href="/#">노드버드</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="profile">
          <Link href="/profile">
            <a href="/#">프로필</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="mail">
          <SearchInput
            enterButton
            value={searchInput}
            onChange={onChangeSearchInput}
            onSearch={onSearch}
          />
        </Menu.Item>
        <Menu.Item>
          {me ? null : (
            <Link href="/signup">
              <a href="/#">회원가입</a>
            </Link>
          )}
        </Menu.Item>
      </Menu>
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          <a
            href="https://github.com/jeenee94"
            target="_blank"
            rel="noreferrer noopener"
          >
            Made by JeeNee
          </a>
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  children: Proptypes.node.isRequired,
};

export default AppLayout;
