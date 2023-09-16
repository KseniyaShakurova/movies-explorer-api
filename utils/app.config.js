require('dotenv').config();

const SECRET = process.env.NODE_ENV === 'production' ? process.env.SECRET_KEY : 'some-secret-key';

module.exports = {
  SECRET,
};
