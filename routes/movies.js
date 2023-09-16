const router = require('express').Router();
const { validationCreateNewMovies, validationDeleteMovies } = require('../middlewares/validations');
const { auth } = require('../middlewares/auth');

const {
  getMovies,
  createNewMovies,
  deleteMovies,
} = require('../controllers/movies');

router.get('/', auth, getMovies);
router.post('/', auth, validationCreateNewMovies, createNewMovies);
router.delete('/:id', auth, validationDeleteMovies, deleteMovies);

module.exports = router;
