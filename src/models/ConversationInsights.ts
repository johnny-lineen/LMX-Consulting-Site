import mongoose, { Schema, model, models } from 'mongoose';

export interface IInsight {
  type: 'goal' | 'preference' | 'constraint' | 'context';
  content: string;
  sourceMessage: string;
  createdAt: Date;
}

export interface IConversationInsights {
  _id: string;
  conversationId: string;
  userId: string;
  insights: IInsight[];
  createdAt: Date;
  updatedAt: Date;
}

const InsightSchema = new Schema<IInsight>({
  type: { 
    type: String, 
    enum: ['goal', 'preference', 'constraint', 'context'], 
    required: true 
  },
  content: { 
    type: String, 
    required: true,
    trim: true
  },
  sourceMessage: { 
    type: String, 
    required: true,
    trim: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, { _id: false });

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
  insights: [InsightSchema],
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
