import mongoose, { Schema, models } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  avatarUrl: String,
  authProvider: String,
  createdAt: { type: Date, default: Date.now },
});

export default models.User || mongoose.model('User', UserSchema);
