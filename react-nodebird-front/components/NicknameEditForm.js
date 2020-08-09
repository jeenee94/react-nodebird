import React, { useCallback } from 'react';
import { Form, Input } from 'antd';
import { useSelector, useDispatch } from 'react-redux';

import useInput from '../hooks/useInput';
import { CHANGE_NICKNAME_REQUEST } from '../reducers/user';

const NicknameEditForm = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const [nickname, onChangeNickname] = useInput(me?.nickname || '');

  const onSubmit = useCallback(() => {
    if (!me.flag) {
      return alert('닉네임 변경 횟수를 초과하였습니다.');
    }
    return dispatch({
      type: CHANGE_NICKNAME_REQUEST,
      data: nickname,
    });
  }, [nickname]);

  return (
    <Form
      style={{
        marginBottom: '20px',
        border: '1px solid #d9d9d9',
        padding: '20px',
      }}
    >
      계정당 1회에 한하여 닉네임을 변경할 수 있습니다. (남은 횟수:{' '}
      {me.flag ? 1 : 0})
      <Input.Search
        value={nickname}
        onChange={onChangeNickname}
        addonBefore="닉네임"
        enterButton="수정"
        onSearch={onSubmit}
        disabled={!me.flag}
        style={{ marginTop: '10px' }}
      />
    </Form>
  );
};

export default NicknameEditForm;
