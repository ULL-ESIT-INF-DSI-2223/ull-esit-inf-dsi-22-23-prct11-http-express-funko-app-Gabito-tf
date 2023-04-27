// FunkoPop.js
import mongoose from 'mongoose';

const FunkoPopSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  type: String,
  genre: String,
  franchise: String,
  number: Number,
  exclusive: Boolean,
  specialFeatures: String,
  marketValue: Number,
});

export { FunkoPopSchema };
