const router = require('express').Router();
const { validationCreateUser, validationLogin } = require('../middlewares/validations');
const userRouter = require('./users');
const movieRouter = require('./movies');
const { createUser, login } = require('../controllers/users');
const NotFound = require('../errors/NotFound');
const { auth } = require('../middlewares/auth');

router.post('/signup', validationCreateUser, createUser);
router.post('/signin', validationLogin, login);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use('/*', (req, res, next) => {
  next(new NotFound('Не известный запрос'));
});

module.exports = router;
