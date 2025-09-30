import mongoose, { Schema, model, models } from 'mongoose';

export interface IConversationInsights {
  _id: string;
  conversationId: string;
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

const ConversationInsightsSchema = new Schema<IConversationInsights>({
  conversationId: { 
    type: String, 
    required: true,
    unique: true,
    index: true
  },
  userId: { 
    type: String, 
    required: true,
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
  collection: 'conversationinsights'
});

// Indexes for efficient querying
ConversationInsightsSchema.index({ conversationId: 1 }, { unique: true });
ConversationInsightsSchema.index({ userId: 1 });

// Update the updatedAt field before saving
ConversationInsightsSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const ConversationInsights = models.ConversationInsights || model<IConversationInsights>('ConversationInsights', ConversationInsightsSchema);
