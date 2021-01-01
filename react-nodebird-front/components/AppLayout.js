import React, { useCallback } from 'react';
import Proptypes from 'prop-types';
import Link from 'next/link';
import { Menu, Input, Row, Col } from 'antd';
import { useSelector } from 'react-redux';
import styled, { createGlobalStyle } from 'styled-components';
import Router from 'next/router';

import LoginForm from './LoginForm';
import UserProfile from './UserProfile';
import useInput from '../hooks/useInput';

const SearchInput = styled(Input.Search)`
  vertical-align: middle;
`;

const Global = createGlobalStyle`
  .ant-row {
    margin-right: 0 !important;
    margin-left: 0 !important;
  }
  
  .ant-col:first-child {
      padding-left: 0 !important;
  }
  
  .ant-col:last-child {
    padding-right: 0 !important;
  }
`;

const AppLayout = ({ children }) => {
  const { me } = useSelector((state) => state.user);
  const [searchInput, onChangeSearchInput, setSearchInput] = useInput('');

  const onSearch = useCallback(() => {
    if (searchInput) {
      Router.push(`/hashtag/${searchInput}`);
    }
    setSearchInput('');
  }, [searchInput]);

  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      <Global />
      <Menu
        mode="horizontal"
        style={{
          position: 'fixed',
          width: '100%',
          zIndex: 2,
          backgroundColor: '#e9edee',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Menu.Item key="home" style={{ position: 'relative' }}>
          <Link href="/">
            <a>
              <b>노드버드</b>
            </a>
          </Link>
        </Menu.Item>
        <Menu.Item key="mail" style={{ flex: 1 }}>
          <SearchInput
            enterButton
            value={searchInput}
            onChange={onChangeSearchInput}
            onSearch={onSearch}
            theme="light"
          />
        </Menu.Item>
        <Menu.Item key="profile">
          <Link href="/profile">
            <a>
              <b>프로필</b>
            </a>
          </Link>
        </Menu.Item>
      </Menu>
      <Row gutter={8} style={{ position: 'relative', top: '45px' }}>
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          {' '}
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  children: Proptypes.node.isRequired,
};

export default AppLayout;
