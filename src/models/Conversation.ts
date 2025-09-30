import mongoose, { Schema, model, models } from 'mongoose';
import { randomUUID } from 'crypto';

export interface IMessage {
  role: 'user' | 'assistant';
  message: string;
  timestamp: Date;
}

export interface IConversation {
  _id: string;
  conversationId: string;
  sessionId: string;
  userId: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  role: { 
    type: String, 
    enum: ['user', 'assistant'], 
    required: true 
  },
  message: { 
    type: String, 
    required: true,
    trim: true
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
}, { _id: false });

const ConversationSchema = new Schema<IConversation>({
  conversationId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true,
    sparse: false,  // Ensures sessionId is always required and indexed
    default: () => randomUUID()  // Auto-generate if not provided
  },
  userId: { 
    type: String, 
    required: true,
    index: true
  },
  messages: [MessageSchema],
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
  collection: 'conversations'
});

// Indexes for efficient querying
ConversationSchema.index({ userId: 1, createdAt: -1 });
ConversationSchema.index({ conversationId: 1 }, { unique: true });
ConversationSchema.index({ sessionId: 1 });

// Pre-save hook: Ensure sessionId is never null or undefined
ConversationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Critical: Auto-generate sessionId if somehow still missing
  if (!this.sessionId) {
    this.sessionId = randomUUID();
    console.warn('⚠️  sessionId was missing and auto-generated:', this.sessionId);
  }
  
  next();
});

export const Conversation = models.Conversation || model<IConversation>('Conversation', ConversationSchema);
