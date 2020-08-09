import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Card, List } from 'antd';
import { StopOutlined } from '@ant-design/icons';
import { UNFOLLOW_REQUEST, REMOVE_FOLLOWER_REQUEST } from '../reducers/user';

const FollowList = ({ header, data }) => {
  const dispatch = useDispatch();
  const oncancel = (id) => () => {
    if (header === '팔로잉') {
      return dispatch({
        type: UNFOLLOW_REQUEST,
        data: id,
      });
    }
    return dispatch({
      type: REMOVE_FOLLOWER_REQUEST,
      data: id,
    });
  };
  return (
    <List
      style={{ marginBottom: '20px' }}
      grid={{ gutter: 4, xs: 2, md: 3 }}
      size="small"
      header={<div>{header}</div>}
      loadMore={
        <div style={{ textAlign: 'center', margin: '10px 0' }}>
          <Button>더 보기</Button>
        </div>
      }
      bordered
      dataSource={data}
      renderItem={(item) => (
        <List.Item style={{ marginTop: '20px' }}>
          <Card
            actions={[<StopOutlined key="stop" onClick={oncancel(item.id)} />]}
          >
            <Card.Meta description={item.nickname} />
          </Card>
        </List.Item>
      )}
    />
  );
};

FollowList.propTypes = {
  header: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
};

export default FollowList;
