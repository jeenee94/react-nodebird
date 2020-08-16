// eslint-disable-next-line import/prefer-default-export
export const frontUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://nodebird.ml'
    : 'http://localhost:3000';
export const backUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://api.nodebird.ml'
    : 'http://localhost:3010';
