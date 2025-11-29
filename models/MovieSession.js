import mongoose from 'mongoose';

const movieSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  movieId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  poster: String,
  userId: String,
  userIp: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: Date,
  totalWatchTime: {
    type: Number, // in seconds
    default: 0
  },
  playerType: {
    type: String,
    enum: ['vidsrc', 'vidlink', 'autoembed', 'iframe', 'translated', 'unknown'], // ADDED 'translated'
    default: 'unknown'
  },
  completed: {
    type: Boolean,
    default: false
  },
  // For easy aggregation
  date: {
    type: String, // Format: YYYY-MM-DD
    index: true
  },
  week: {
    type: String, // Format: YYYY-WW
    index: true
  },
  month: {
    type: String, // Format: YYYY-MM
    index: true
  }
}, {
  timestamps: true
});

const MovieSession = mongoose.models.MovieSession || mongoose.model('MovieSession', movieSessionSchema);

export default MovieSession;