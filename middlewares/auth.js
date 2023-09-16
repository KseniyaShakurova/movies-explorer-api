require('dotenv').config();
const jwt = require('jsonwebtoken');

const { SECRET } = require('../utils/app.config');

const Unauthorized = require('../errors/Unauthorized');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  console.log(req.headers);
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Unauthorized('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    console.log(token);
    console.log(SECRET);
    payload = jwt.verify(token, SECRET);
  } catch (err) {
    throw new Unauthorized('Необходима авторизация');
  }

  req.user = payload;

  next();
};
