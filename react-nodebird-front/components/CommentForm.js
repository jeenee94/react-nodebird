import { Button, Form, Input } from 'antd';
import React, { useCallback, useState } from 'react';

const CommentForm = ({ post }) => {
  const [commentText, setCommentText] = useState('');

  const onSubmitComment = useCallback(() => {
    setCommentText('');
  }, [commentText]);

  const onChangeCommentText = useCallback((e) => {
    setCommentText(e.target.value);
  }, []);

  return (
    <Form onFinish={onSubmitComment}>
      <Form.Item style={{ position: 'relative', margin: 0 }}>
        <Input.TextArea
          rows={4}
          value={commentText}
          onChange={onChangeCommentText}
        />
        <Button type="primary" htmlType="submit" style={{ float: 'right' }}>
          삐약
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CommentForm;
