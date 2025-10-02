import mongoose, { Schema, model, models } from 'mongoose';

/**
 * Prompt Model - MongoDB schema for storing AI prompts
 * 
 * Design Decision: This model follows the same patterns as the Resource model
 * for consistency. Includes all required fields for prompt management with
 * proper validation and indexing for efficient queries.
 */
export interface IPrompt {
  _id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  prompt: string;
  createdAt: Date;
  updatedAt: Date;
}

const PromptSchema = new Schema<IPrompt>({
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title must be less than 200 characters']
  },
  description: { 
    type: String, 
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description must be less than 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    maxlength: [100, 'Category must be less than 100 characters']
  },
  tags: {
    type: [String],
    default: [],
    validate: {
      validator: function(tags: string[]) {
        return tags.length <= 10; // Limit to 10 tags max
      },
      message: 'Cannot have more than 10 tags'
    }
  },
  prompt: {
    type: String,
    required: [true, 'Prompt text is required'],
    trim: true,
    maxlength: [5000, 'Prompt must be less than 5000 characters']
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
PromptSchema.index({ category: 1, createdAt: -1 });
PromptSchema.index({ tags: 1 });
PromptSchema.index({ title: 'text', description: 'text', prompt: 'text' }); // Text search index
PromptSchema.index({ createdAt: -1 });

// Force refresh the model to ensure new schema is used
if (models.Prompt) {
  delete models.Prompt;
}

export const Prompt = model<IPrompt>('Prompt', PromptSchema);
