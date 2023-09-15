const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const NotFound = require('../errors/NotFound');

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use('/*', (req, res, next) => {
  next(new NotFound('Не известный запрос'));
});

module.exports = router;
