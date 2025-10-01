import mongoose, { Schema, model, models, Types } from 'mongoose';

export interface ITestimonial {
  _id: string;
  // Legacy support: old documents may have userId
  userId?: Types.ObjectId;
  userModel: 'User' | 'TestimonialUser';
  userRef: Types.ObjectId;
  clientName: string;
  email: string;
  testimonial: string;
  rating?: number;
  source?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  approvedAt?: Date | null;
}

const TestimonialSchema = new Schema<ITestimonial>({
  // Legacy field; do not use for new writes
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  userModel: {
    type: String,
    enum: ['User', 'TestimonialUser'],
    required: true
  },
  userRef: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'userModel'
  },
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  testimonial: {
    type: String,
    required: [true, 'Testimonial text is required'],
    trim: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: false
  },
  source: {
    type: String,
    default: 'consultation',
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  approvedAt: {
    type: Date,
    required: false
  }
});

export const Testimonial = models.Testimonial || model<ITestimonial>('Testimonial', TestimonialSchema);


