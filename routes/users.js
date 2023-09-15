const router = require('express').Router();
const { auth } = require('../middlewares/auth');
const { validationEditUser } = require('../middlewares/validations');

const {
  editUser, getUserInfo,
} = require('../controllers/users');

router.get('/me', auth, getUserInfo);
router.patch('/me', auth, validationEditUser, editUser);

module.exports = router;
