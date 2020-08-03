import { all, fork } from 'redux-saga/effects';
import axios from 'axios';

import postSaga from './post';
import userSaga from './user';

axios.defaults.baseURL = 'http://localhost:3010';

export default function* rootSaga() {
  yield all([fork(postSaga), fork(userSaga)]);
}