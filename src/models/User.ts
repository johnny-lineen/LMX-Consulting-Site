import mongoose, { Schema, model, models } from 'mongoose';

export interface IUser {
  _id: string;
  email: string;
  password: string | null;
  name: string;
  role?: 'admin' | 'client' | 'user';
  isAdmin: boolean;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { 
    type: String, 
    unique: true, 
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  password: { 
    type: String,
    default: null,
    required: false,
    select: false
  },
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name must be less than 50 characters']
  },
  role: {
    type: String,
    enum: ['admin', 'client', 'user'],
    default: 'client'
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Ensure email is unique
UserSchema.index({ email: 1 }, { unique: true });

// Don't include password in JSON output
UserSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Optional virtual to indicate if a user needs password setup
UserSchema.virtual('requiresPasswordSetup').get(function(this: any) {
  return !this.password;
});

export const User = models.User || model<IUser>('User', UserSchema);