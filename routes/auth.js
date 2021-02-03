const express = require('express');

const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require('../middlewares/auth');

// controller
const {
  updateUser,
  currentUser,

  resetPassword,
  registerUser,
  authUser,
  forgotPassword,
} = require('../controllers/auth');
const {
  resetPasswordValidator,
  forgotPasswordValidator,
} = require('../middlewares/validator');
const { runValidation } = require('../middlewares');

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/current-user', authCheck, currentUser);
router.route('/profile').get(authCheck, currentUser).put(authCheck, updateUser);
router.post('/current-admin', authCheck, adminCheck, currentUser);
router.put(
  '/forgot-password',
  forgotPasswordValidator,
  runValidation,
  forgotPassword
);
router.put(
  '/reset-password',
  resetPasswordValidator,
  runValidation,
  resetPassword
);

// router.put('/forgot-password', forgotPassword);
// router.put('/reset-password', resetPasswordValidator, resetPassword);

module.exports = router;
