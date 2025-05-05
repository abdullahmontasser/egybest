const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  favoriteMovies: [
    {
      movieId: {
        type: String,
        required: true
      },
      title: String,
      poster: String,
      addedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  watchHistory: [
    {
      movieId: {
        type: String,
        required: true
      },
      title: String,
      poster: String,
      progress: {
        type: Number,
        default: 0
      },
      watchedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'dark'
    },
    language: {
      type: String,
      default: 'en'
    },
    notifications: {
      type: Boolean,
      default: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before save
ProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Profile', ProfileSchema);
