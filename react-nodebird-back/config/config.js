const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'react_nodebird_development',
    host: 'mydbinstance.cqrninfrgcds.ap-northeast-2.rds.amazonaws.com',
    dialect: 'mysql',
    logging: false,
    timezone: '+09:00',
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'react_nodebird_test',
    host: 'mydbinstance.cqrninfrgcds.ap-northeast-2.rds.amazonaws.com',
    dialect: 'mysql',
    timezone: '+09:00',
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'react_nodebird_production',
    host: 'mydbinstance.cqrninfrgcds.ap-northeast-2.rds.amazonaws.com',
    dialect: 'mysql',
    timezone: '+09:00',
  },
};
