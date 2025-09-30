import mongoose, { Schema, model, models } from 'mongoose';

export interface IUserInsights {
  _id: string;
  userId: string;
  advice: string[];
  bottlenecks: string[];
  context: string[];
  goals: string[];
  ideas: string[];
  questions: string[];
  strategies: string[];
  tags: string[];
  confidenceScore: number;
  sessionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserInsightsSchema = new Schema<IUserInsights>({
  userId: { 
    type: String, 
    required: true,
    unique: true,
    index: true
  },
  advice: [{ 
    type: String, 
    trim: true 
  }],
  bottlenecks: [{ 
    type: String, 
    trim: true 
  }],
  context: [{ 
    type: String, 
    trim: true 
  }],
  goals: [{ 
    type: String, 
    trim: true 
  }],
  ideas: [{ 
    type: String, 
    trim: true 
  }],
  questions: [{ 
    type: String, 
    trim: true 
  }],
  strategies: [{ 
    type: String, 
    trim: true 
  }],
  tags: [{ 
    type: String, 
    trim: true 
  }],
  confidenceScore: { 
    type: Number, 
    min: 0, 
    max: 1, 
    default: 0.5 
  },
  sessionId: { 
    type: String, 
    trim: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true,
  collection: 'userinsights'
});

// Indexes for efficient querying
UserInsightsSchema.index({ userId: 1 }, { unique: true });

// Update the updatedAt field before saving
UserInsightsSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const UserInsights = models.UserInsights || model<IUserInsights>('UserInsights', UserInsightsSchema);
