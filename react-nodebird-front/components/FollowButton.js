import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import { FOLLOW_REQUEST, UNFOLLOW_REQUEST } from '../reducers/user';

const FollowButton = ({ post }) => {
  const dispatch = useDispatch();
  const { me, followLoading, unfollowLoading } = useSelector(
    (state) => state.user,
  );
  const isFollowing = me?.Followings.find(
    (v) => v.id === (post?.Retweet?.UserId || post.User.id),
  );

  const onFollow = useCallback(() => {
    if (isFollowing) {
      dispatch({
        type: UNFOLLOW_REQUEST,
        data: post?.Retweet?.UserId || post.User.id,
      });
    } else {
      dispatch({
        type: FOLLOW_REQUEST,
        data: post?.Retweet?.UserId || post.User.id,
      });
    }
  }, [isFollowing]);

  return (
    <Button
      onClick={onFollow}
      loading={isFollowing ? unfollowLoading : followLoading}
      size="small"
      type="primary"
      danger={isFollowing}
      style={{ fontSize: 11, marginLeft: 5 }}
    >
      {isFollowing ? '언팔로우' : '팔로우'}
    </Button>
  );
};

FollowButton.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
    Retweet: PropTypes.objectOf(PropTypes.any),
  }).isRequired,
};

export default FollowButton;
