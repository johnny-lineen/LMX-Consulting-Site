import mongoose, { Schema } from 'mongoose';

const TestimonialUserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.TestimonialUser || mongoose.model('TestimonialUser', TestimonialUserSchema);


