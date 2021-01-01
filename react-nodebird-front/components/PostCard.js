import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Card,
  Popover,
  Button,
  Avatar,
  Comment,
  List,
  message,
  Modal,
  Input,
  Popconfirm,
} from 'antd';
import {
  RetweetOutlined,
  HeartOutlined,
  HeartFilled,
  MessageOutlined,
  EllipsisOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import moment from 'moment';

import useInput from '../hooks/useInput';
import PostImages from './PostImages';
import CommentForm from './CommentForm';
import PostCardContent from './PostCardContent';
import FollowButton from './FollowButton';
import {
  REMOVE_POST_REQUEST,
  LIKE_POST_REQUEST,
  UNLIKE_POST_REQUEST,
  RETWEET_REQUEST,
  UPDATE_POST_REQUEST,
  REPORT_POST_REQUEST,
} from '../reducers/post';

const { TextArea } = Input;

moment.locale('ko');

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [reportText, onChangeReportText, setReportText] = useInput('');
  const id = useSelector((state) => state.user.me?.id);
  const { removePostLoading } = useSelector(
    (state) => state.post.removePostLoading,
  );
  const reportPostLoading = useSelector(
    (state) => state.post.reportPostLoading,
  );
  const reportPostDone = useSelector((state) => state.post.reportPostDone);
  const reportPostError = useSelector((state) => state.post.reportPostError);

  const onRetweet = useCallback(() => {
    if (!id) {
      return message.error('로그인이 필요합니다.');
    }
    return dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
    });
  }, [id]);

  const onClickUpdate = useCallback(() => {
    setEditMode(true);
  }, []);

  const onCancelUpdate = useCallback(() => {
    setEditMode(false);
  }, []);

  const onUpdatePost = useCallback(
    (editText) => () => {
      if (editText.length < 10 || !editText.trim()) {
        message.error('10자 이상의 게시글을 작성하세요.');
      } else {
        dispatch({
          type: UPDATE_POST_REQUEST,
          data: {
            PostId: post.id,
            content: editText,
          },
        });
      }
    },
    [post],
  );

  const onLike = useCallback(() => {
    if (!id) {
      return message.error('로그인이 필요합니다.');
    }
    return dispatch({
      type: LIKE_POST_REQUEST,
      data: post.id,
    });
  }, [id]);

  const onUnlike = useCallback(() => {
    if (!id) {
      return message.error('로그인이 필요합니다.');
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
      return message.error('로그인이 필요합니다.');
    }
    return dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    });
  }, [id]);

  const onClickReport = useCallback(() => {
    setModalVisible(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const onSubmitReport = useCallback(() => {
    console.log(id, post.id, reportText);
    dispatch({
      type: REPORT_POST_REQUEST,
      data: {
        postId: post.id,
        content: reportText,
      },
    });
  }, [reportText]);

  useEffect(() => {
    if (reportPostDone || reportPostError) {
      setModalVisible(false);
      setReportText('');
    }
  }, [reportPostDone, reportPostError]);

  const liked = post.Likers.find((v) => v.id === id);
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
                    {!post.Retweet && (
                      <Button onClick={onClickUpdate}>수정</Button>
                    )}
                    <Popconfirm
                      title="정말 삭제하시겠습니까?"
                      okText="Yes"
                      cancelText="No"
                      onConfirm={onRemovePost}
                      placement="right"
                      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                    >
                      <Button type="danger" loading={removePostLoading}>
                        삭제
                      </Button>
                    </Popconfirm>
                  </>
                ) : (
                  <Button onClick={onClickReport}>신고</Button>
                )}
              </Button.Group>
            }
          >
            <EllipsisOutlined />
          </Popover>,
        ]}
        title={
          post.RetweetId ? (
            <>
              <Link href={`/user/${post.User.id}`} prefetch={false}>
                <a>
                  {post.User.avatar ? (
                    <Avatar src={post.User.avatar} />
                  ) : (
                    <Avatar>{post.User.nickname[0]}</Avatar>
                  )}
                </a>
              </Link>
              <span style={{ marginLeft: 10 }}>
                {post.User.nickname}님이 리트윗하셨습니다.
              </span>
              <span
                style={{
                  float: 'right',
                  fontSize: '14px',
                  textAlign: 'center',
                }}
              >
                {moment(post.createdAt).fromNow()}
              </span>
            </>
          ) : null
        }
      >
        <Modal
          title="신고하기"
          visible={modalVisible}
          onOk={onSubmitReport}
          confirmLoading={reportPostLoading}
          onCancel={onCloseModal}
        >
          <form>
            <TextArea value={reportText} onChange={onChangeReportText} />
          </form>
        </Modal>
        {post.RetweetId && post.Retweet ? (
          <Card>
            <Card.Meta
              avatar={
                <Link href={`/user/${post.Retweet.User.id}`} prefetch={false}>
                  <a>
                    {post.Retweet.User.avatar ? (
                      <Avatar src={post.Retweet.User.avatar} />
                    ) : (
                      <Avatar>{post.Retweet.User.nickname[0]}</Avatar>
                    )}
                  </a>
                </Link>
              }
              title={
                <>
                  <span style={{ fontWeight: '700' }}>
                    {post.Retweet.User.nickname}
                  </span>
                  {id && id !== post.Retweet.User.id && (
                    <FollowButton post={post} />
                  )}
                  <span style={{ float: 'right', fontSize: '12px' }}>
                    {moment(post.createdAt).fromNow()}
                  </span>
                </>
              }
              description={
                <>
                  {post.Retweet.Images[0] && (
                    <PostImages images={post.Retweet.Images} />
                  )}
                  <PostCardContent
                    postData={post.Retweet.content}
                    onUpdatePost={onUpdatePost}
                    onCancelUpdate={onCancelUpdate}
                    editMode={false}
                  />
                </>
              }
            />
          </Card>
        ) : (
          <Card.Meta
            avatar={
              <Link href={`/user/${post.User.id}`} prefetch={false}>
                <a>
                  {post.User.avatar ? (
                    <Avatar src={post.User.avatar} />
                  ) : (
                    <Avatar>{post.User.nickname[0]}</Avatar>
                  )}
                </a>
              </Link>
            }
            title={
              <>
                <span style={{ fontWeight: '700' }}>{post.User.nickname}</span>
                {id && id !== post.User.id && <FollowButton post={post} />}
                <span style={{ float: 'right', fontSize: '12px' }}>
                  {moment(post.createdAt).fromNow()}
                </span>
              </>
            }
            description={
              <>
                {post.Images[0] && <PostImages images={post.Images} />}
                <PostCardContent
                  postData={post.content}
                  onUpdatePost={onUpdatePost}
                  onCancelUpdate={onCancelUpdate}
                  editMode={editMode}
                />
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
                    <Link href={`/user/${item.User.id}`} prefetch={false}>
                      <a>
                        {item.User.avatar ? (
                          <Avatar src={item.User.avatar} />
                        ) : (
                          <Avatar>{item.User.nickname[0]}</Avatar>
                        )}
                      </a>
                    </Link>
                  }
                  content={item.content}
                  datetime={<span>{moment(item.createdAt).fromNow()}</span>}
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
