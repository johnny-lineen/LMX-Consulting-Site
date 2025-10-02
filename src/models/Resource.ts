import mongoose, { Schema, model, models } from 'mongoose';

export interface IResource {
  _id: string;
  title: string;
  description: string;
  type: 'notion' | 'ebook' | 'cheatsheet' | 'video' | 'scanned'; // Added 'scanned' for imported resources
  slug: string; // URL-safe slug for frontend routing
  category: string; // For organization and filtering
  fileUrl?: string; // URL to resource (Notion link, PDF, etc.) - optional for scanned resources
  filePath?: string; // File path for scanned resources - required for 'scanned' type
  folderPath?: string; // Path to resource folder (admin-only)
  mainFile?: string; // Path to main resource file (legacy)
  coverImage: string; // Always present (actual or placeholder)
  images?: string[]; // Additional product/preview images
  tags: string[];
  gated: boolean; // Whether resource requires email capture
  status: 'draft' | 'live' | 'archived'; // Resource visibility status
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
    lowercase: true, // Ensure all values are lowercase
    enum: {
      values: ['notion', 'ebook', 'cheatsheet', 'video', 'scanned'],
      message: 'Invalid resource type. Please select from Notion Template, Ebook, Cheat Sheet, Video, or Scanned.'
    }
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    trim: true,
    lowercase: true,
    unique: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    maxlength: [100, 'Category must be less than 100 characters']
  },
  fileUrl: {
    type: String,
    required: function(this: IResource) {
      // Required for: notion, ebook, cheatsheet, video
      // Not required for: scanned (uses filePath instead)
      return ['notion', 'ebook', 'cheatsheet', 'video'].includes(this.type);
    },
    trim: true,
    validate: {
      validator: function(this: IResource, value: string): boolean {
        if (this.type === 'notion') {
          return Boolean(value && (value.includes('notion.so') || value.includes('notion.site')));
        }
        if (this.type === 'ebook') {
          return Boolean(value && (value.endsWith('.pdf') || value.includes('.pdf')));
        }
        return true; // Other types can have any URL
      },
      message: function(props: any): string {
        const type = props.path.split('.')[0]; // Get the document type
        if (type === 'notion') {
          return 'Notion templates must include a valid Notion link';
        }
        if (type === 'ebook') {
          return 'Ebooks must include a valid PDF link';
        }
        return 'Invalid file URL format';
      }
    }
  },
  filePath: { 
    type: String, 
    required: function(this: IResource) {
      // Only required for scanned resources
      return this.type === 'scanned';
    },
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
  },
  gated: {
    type: Boolean,
    required: [true, 'Gated status is required'],
    default: false
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['draft', 'live', 'archived'],
    default: 'draft'
  }
}, {
  timestamps: true
});

// Index for efficient queries
ResourceSchema.index({ type: 1, createdAt: -1 });
ResourceSchema.index({ tags: 1 });
ResourceSchema.index({ slug: 1 }, { unique: true });
ResourceSchema.index({ category: 1, status: 1 });
ResourceSchema.index({ status: 1, createdAt: -1 });
ResourceSchema.index({ gated: 1, status: 1 });

// Force refresh the model to ensure new schema is used
if (models.Resource) {
  delete models.Resource;
}
export const Resource = model<IResource>('Resource', ResourceSchema);
