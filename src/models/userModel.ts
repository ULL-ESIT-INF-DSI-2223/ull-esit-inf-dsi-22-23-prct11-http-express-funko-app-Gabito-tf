// userModel.js
import mongoose from 'mongoose';
import { FunkoPopSchema } from './funkoModel.js';

const UserSchema = new mongoose.Schema({
  user: {
    type: String,
    unique: true,
    required: true,
  },
  funkos: [FunkoPopSchema],
});

const User = mongoose.model('User', UserSchema);
export default User;
