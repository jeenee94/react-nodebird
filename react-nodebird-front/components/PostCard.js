import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Card, Popover, Button, Avatar, Comment, List } from 'antd';
import {
  RetweetOutlined,
  HeartOutlined,
  HeartFilled,
  MessageOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';

import PostImages from './PostImages';
import CommentForm from './CommentForm';
import PostCardContent from './PostCardContent';
import FollowButton from './FollowButton';
import {
  REMOVE_POST_REQUEST,
  LIKE_POST_REQUEST,
  UNLIKE_POST_REQUEST,
  RETWEET_REQUEST,
} from '../reducers/post';

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const [commentFormOpened, setCommentFormOpened] = useState(false);

  const id = useSelector((state) => state.user.me?.id);
  const { removePostLoading } = useSelector((state) => state.post);

  const onRetweet = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
    });
  }, [id]);

  const onLike = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch({
      type: LIKE_POST_REQUEST,
      data: post.id,
    });
  }, [id]);

  const onUnlike = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch({
      type: UNLIKE_POST_REQUEST,
      data: post.id,
    });
  }, [id]);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
  }, []);

  const onRemovePost = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    });
  }, [id]);

  const liked = post.Likers.find((v) => v.id === id);
  // TODO: 좋아요 수, 댓글 수 표시
  return (
    <>
      <Card
        style={{ marginBottom: '20px' }}
        actions={[
          <RetweetOutlined key="retweet" onClick={onRetweet} />,
          liked ? (
            <HeartFilled
              key="heart"
              style={{ color: '#B22222' }}
              onClick={onUnlike}
            />
          ) : (
            <HeartOutlined key="heart" onClick={onLike} />
          ),
          <MessageOutlined key="comment" onClick={onToggleComment} />,
          <Popover
            key="ellipsis"
            content={
              <Button.Group>
                {id && post.User.id === id ? (
                  <>
                    <Button>수정</Button>
                    <Button
                      type="danger"
                      onClick={onRemovePost}
                      loading={removePostLoading}
                    >
                      삭제
                    </Button>
                  </>
                ) : (
                  <Button>신고</Button>
                )}
              </Button.Group>
            }
          >
            <EllipsisOutlined />
          </Popover>,
        ]}
        title={
          post.RetweetId ? `${post.User.nickname}님이 리트윗하셨습니다.` : null
        }
      >
        {post.RetweetId && post.Retweet ? (
          <Card>
            <Card.Meta
              avatar={<Avatar>{post.Retweet.User.nickname[0]}</Avatar>}
              title={
                <>
                  {post.Retweet.User.nickname}
                  {id && id !== post.Retweet.User.id && (
                    <FollowButton post={post} />
                  )}
                </>
              }
              description={
                <>
                  {post.Retweet.Images[0] && (
                    <PostImages images={post.Retweet.Images} />
                  )}
                  <PostCardContent postData={post.Retweet.content} />
                </>
              }
            />
          </Card>
        ) : (
          <Card.Meta
            avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
            title={
              <>
                {post.User.nickname}
                {id && id !== post.User.id && <FollowButton post={post} />}
              </>
            }
            description={
              <>
                {post.Images[0] && <PostImages images={post.Images} />}
                <PostCardContent postData={post.content} />
              </>
            }
          />
        )}
      </Card>
      {commentFormOpened && (
        <>
          {id && <CommentForm post={post} />}
          <List
            header={`${post.Comments.length}개의 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={(item) => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={
                    <Link
                      href={{ pathname: '/user', query: { id: item.User.id } }}
                      as={`/user/${item.User.id}`}
                    >
                      <a href="/#">
                        <Avatar>{item.User.nickname[0]}</Avatar>
                      </a>
                    </Link>
                  }
                  content={item.content}
                />
              </li>
            )}
          />
        </>
      )}
    </>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
    Likers: PropTypes.arrayOf(PropTypes.object),
    RetweetId: PropTypes.number,
    Retweet: PropTypes.objectOf(PropTypes.any),
  }).isRequired,
};

export default PostCard;
