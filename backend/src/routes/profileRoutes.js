const express = require('express');
const {
  getProfile,
  updateProfile,
  addFavorite,
  removeFavorite,
  getFavorites
} = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes in this router
router.use(protect);

router.route('/')
  .get(getProfile)
  .put(updateProfile);

router.route('/favorites')
  .get(getFavorites)
  .post(addFavorite);

router.delete('/favorites/:movieId', removeFavorite);

module.exports = router;
