import mongoose from 'mongoose';

const adminSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  userIp: String,
  userAgent: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // 24 hours in seconds - this creates the TTL index automatically
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// REMOVED the duplicate index - mongoose automatically creates TTL from 'expires' property

const AdminSession = mongoose.models.AdminSession || mongoose.model('AdminSession', adminSessionSchema);

export default AdminSession;