import React, { useCallback, useRef, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';

import {
  ADD_POST_REQUEST,
  UPLOAD_IMAGES_REQUEST,
  REMOVE_IMAGE,
} from '../reducers/post';
import useInput from '../hooks/useInput';
import { backUrl } from '../config/config';

const PostForm = () => {
  const dispatch = useDispatch();
  const [text, onChangeText, setText] = useInput('');
  const { imagePaths, addPostDone } = useSelector((state) => state.post);

  useEffect(() => {
    if (addPostDone) {
      setText('');
    }
  }, [addPostDone]);

  const onSubmit = useCallback(() => {
    if (text.length < 10 || !text.trim()) {
      return message.error('10자 이상의 게시글을 작성하세요.');
    }
    const formData = new FormData();
    imagePaths.forEach((p) => {
      formData.append('image', p);
    });
    formData.append('content', text);
    return dispatch({
      type: ADD_POST_REQUEST,
      data: formData,
    });
  }, [text, imagePaths]);

  const imageInput = useRef();
  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onChangeImages = useCallback((e) => {
    const imageFormData = new FormData();
    [].forEach.call(e.target.files, (f) => {
      imageFormData.append('image', f);
    });
    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    });
  });

  const onRemoveImage = useCallback((index) => () => {
    dispatch({
      type: REMOVE_IMAGE,
      data: index,
    });
  });

  return (
    <Form
      style={{ margin: '10px 0 20px' }}
      encType="multipart/form-data"
      onFinish={onSubmit}
    >
      <Input.TextArea
        value={text}
        onChange={onChangeText}
        maxLength={140}
        placeholder="오늘 하루는 어떠셨나요? (10자 이상)"
      />
      <div>
        <input
          type="file"
          name="image"
          accept="image/*"
          multiple
          hidden
          ref={imageInput}
          onChange={onChangeImages}
        />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button type="primary" style={{ float: 'right' }} htmlType="submit">
          짹짹
        </Button>
      </div>
      <div>
        {imagePaths.map((v, i) => (
          <div key={v} style={{ display: 'inline-block' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={
                  process.env.NODE_ENV === 'production'
                    ? v.replace(/\/thumb\//, '/original/')
                    : `${backUrl}/${v}`
                }
                style={{ width: '200px' }}
                alt={v}
              />
              <CloseOutlined
                style={{
                  position: 'absolute',
                  color: 'red',
                  right: '0',
                  fontSize: '16px',
                }}
                onClick={onRemoveImage(i)}
              />
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};

export default PostForm;
