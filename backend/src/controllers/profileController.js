const Profile = require('../models/Profile');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get current user's profile
// @route   GET /api/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    // Find the profile based on the user id from the auth middleware
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', 'username email');

    if (!profile) {
      return next(new ErrorResponse('Profile not found', 404));
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update profile settings
// @route   PUT /api/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return next(new ErrorResponse('Profile not found', 404));
    }

    // Only allow certain fields to be updated
    const { preferences } = req.body;

    // Update profile preferences
    if (preferences) {
      profile.preferences = {
        ...profile.preferences,
        ...preferences
      };
    }

    await profile.save();

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add a movie to favorites
// @route   POST /api/profile/favorites
// @access  Private
exports.addFavorite = async (req, res, next) => {
  try {
    const { movieId, title, poster } = req.body;

    if (!movieId) {
      return next(new ErrorResponse('Movie ID is required', 400));
    }

    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return next(new ErrorResponse('Profile not found', 404));
    }

    // Check if movie is already in favorites
    const existingFavorite = profile.favoriteMovies.find(
      movie => movie.movieId === movieId
    );

    if (existingFavorite) {
      return next(new ErrorResponse('Movie already in favorites', 400));
    }

    // Add to favorites
    profile.favoriteMovies.push({
      movieId,
      title,
      poster,
      addedAt: Date.now()
    });

    await profile.save();

    res.status(200).json({
      success: true,
      data: profile.favoriteMovies
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove a movie from favorites
// @route   DELETE /api/profile/favorites/:movieId
// @access  Private
exports.removeFavorite = async (req, res, next) => {
  try {
    const { movieId } = req.params;

    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return next(new ErrorResponse('Profile not found', 404));
    }

    // Find the index of the movie in favorites
    const favoriteIndex = profile.favoriteMovies.findIndex(
      movie => movie.movieId === movieId
    );

    if (favoriteIndex === -1) {
      return next(new ErrorResponse('Movie not found in favorites', 404));
    }

    // Remove from favorites
    profile.favoriteMovies.splice(favoriteIndex, 1);
    await profile.save();

    res.status(200).json({
      success: true,
      data: profile.favoriteMovies
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's favorite movies
// @route   GET /api/profile/favorites
// @access  Private
exports.getFavorites = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return next(new ErrorResponse('Profile not found', 404));
    }

    res.status(200).json({
      success: true,
      data: profile.favoriteMovies
    });
  } catch (err) {
    next(err);
  }
};
