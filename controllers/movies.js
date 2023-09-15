const Movie = require('../models/movie');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');
const BadRequest = require('../errors/BadRequest');

const NotError = 200;
const CreateCode = 201;

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.status(NotError).send(movies))
    .catch(next);
};

const createNewMovies = (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailerLink, nameRU, nameEN,
    thumbnail, movieId,
  } = req.body;
  const owner = (req.user._id);

  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.status(CreateCode).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании карточки фильма.'));
      } else {
        next(err);
      }
    });
};

const deleteMovies = (req, res, next) => {
  const { id } = req.params;

  Movie.findById(id)
    .orFail(() => {
      throw new NotFound('Карточка с указанным _id не найдена');
    })
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new Forbidden('Вы не можете удалить этот фильм');
      }
      return Movie.findByIdAndRemove(id).then(() => res.status(200).send({ message: 'Фильм успешно удален' }));
    })
    .catch(next);
};

module.exports = {
  deleteMovies,
  getMovies,
  createNewMovies,
};
