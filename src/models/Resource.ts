import mongoose, { Schema, model, models } from 'mongoose';

export interface IResource {
  _id: string;
  title: string;
  description: string;
  type: string; // ebook, checklist, notion-template, etc.
  slug: string; // URL-safe slug for frontend routing
  filePath: string;
  folderPath?: string; // Path to resource folder (admin-only)
  mainFile?: string; // Path to main resource file
  coverImage: string; // Always present (actual or placeholder)
  images?: string[]; // Additional product/preview images
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new Schema<IResource>({
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
    maxlength: [1000, 'Description must be less than 1000 characters']
  },
  type: { 
    type: String, 
    required: [true, 'Type is required'],
    trim: true,
    enum: ['ebook', 'checklist', 'notion-template', 'guide', 'toolkit', 'other']
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    trim: true,
    lowercase: true,
    unique: true
  },
  filePath: { 
    type: String, 
    required: [true, 'File path is required'],
    trim: true
  },
  folderPath: {
    type: String,
    trim: true
  },
  mainFile: {
    type: String,
    trim: true
  },
  coverImage: {
    type: String,
    required: [true, 'Cover image is required'],
    trim: true,
    default: '/images/default-cover.svg'
  },
  images: {
    type: [String],
    default: []
  },
  tags: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

// Index for efficient queries
ResourceSchema.index({ type: 1, createdAt: -1 });
ResourceSchema.index({ tags: 1 });
ResourceSchema.index({ slug: 1 }, { unique: true });

export const Resource = models.Resource || model<IResource>('Resource', ResourceSchema);
