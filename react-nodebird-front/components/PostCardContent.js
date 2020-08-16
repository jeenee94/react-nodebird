import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Input, Button, Popconfirm } from 'antd';
import { useSelector } from 'react-redux';

const { TextArea } = Input;

const PostCardContent = ({
  postData,
  editMode,
  onUpdatePost,
  onCancelUpdate,
}) => {
  const { updatePostLoading, updatePostDone } = useSelector(
    (state) => state.post,
  );
  const [editText, setEditText] = useState(postData);

  useEffect(() => {
    if (updatePostDone) {
      onCancelUpdate();
    }
  }, [updatePostDone]);

  const onChangeText = useCallback((e) => {
    setEditText(e.target.value);
  });

  return (
    <div>
      {editMode ? (
        <>
          <TextArea value={editText} onChange={onChangeText} />
          <Button.Group>
            <Popconfirm
              placement="left"
              title="확인을 누르시면 게시글이 수정됩니다."
              onConfirm={onUpdatePost(editText)}
              okText="확인"
              cancelText="취소"
            >
              <Button loading={updatePostLoading} type="link">
                수정
              </Button>
            </Popconfirm>
            <Button onClick={onCancelUpdate} type="link" danger>
              취소
            </Button>
          </Button.Group>
        </>
      ) : (
        postData.split(/(#[^\s#]+)/g).map((v, i) => {
          if (v.match(/(#[^\s]+)/)) {
            return (
              <Link
                href={`/hashtag/${v.slice(1)}`}
                prefetch={false}
                key={v.slice(1).concat(i)}
              >
                <a>{v}</a>
              </Link>
            );
          }
          return v;
        })
      )}
    </div>
  );
};

PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
  editMode: PropTypes.bool.isRequired,
  onUpdatePost: PropTypes.func.isRequired,
  onCancelUpdate: PropTypes.func.isRequired,
};

export default PostCardContent;
