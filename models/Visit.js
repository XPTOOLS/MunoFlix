import mongoose from 'mongoose';

const VisitSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  page: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    default: null
  },
  sessionId: {
    type: String,
    required: true
  },
  userAgent: String,
  ipAddress: String,
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
});

// Create indexes for better performance
VisitSchema.index({ date: 1, page: 1 });
VisitSchema.index({ week: 1 });
VisitSchema.index({ month: 1 });

export default mongoose.models.Visit || mongoose.model('Visit', VisitSchema);