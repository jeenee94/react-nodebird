import React from 'react';
import Proptypes from 'prop-types';
import Head from 'next/head';
import 'antd/dist/antd.css';
import withReduxSaga from 'next-redux-saga';

import wrapper from '../store/configureStore';

const App = ({ Component }) => {
  return (
    <>
      <Head>
        <title>NodeBird</title>
      </Head>
      <Component />
    </>
  );
};

App.prop_types = {
  Component: Proptypes.elementType.isRequired,
};

export default wrapper.withRedux(withReduxSaga(App));
