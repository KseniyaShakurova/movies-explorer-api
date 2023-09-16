const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const { SECRET } = require('../utils/app.config');

const ConflictError = require('../errors/ConflictError');
const newError = require('../middlewares/newError');
// const Unauthorized = require('../errors/Unauthorized');
require('dotenv').config();

const NotError = 200;

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      } else if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequest(err.message));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const payload = { _id: user._id };
      const token = jwt.sign(payload, SECRET, { expiresIn: '7d' });
      console.log(token);
      console.log(SECRET);
      res.status(NotError).send({ token });
      console.log(token);
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail()
    .then((user) => {
      res.status(NotError).send({ data: user });
    })

    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return newError(NotFound, req, res);
      }

      return next(err);
    });
};

const editUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(NotFound).send({ message: ' Переданы некорректные данные при обновлении профиля.' });
      }
      return res.status(NotError).send({ data: user });
    })
    .catch((error) => {
      if (error.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      } else if ((error.name === 'ValidationError')) {
        next(new BadRequest(error.message));
      } else {
        next(error);
      }
    });
};

module.exports = {
  getUserInfo,
  createUser,
  editUser,
  login,
};
