import { useState, useEffect, FormEvent } from 'react';
import { Plus, Trash2, MessageSquare, Check, AlertCircle, X, Copy } from 'lucide-react';

/**
 * AdminPromptForm Component - Prompt Management Section
 * 
 * Design Decision: Follows the same patterns as the admin resources page
 * with consistent styling, form validation, and user experience.
 * Integrates seamlessly with the existing admin dashboard design.
 */

interface Prompt {
  _id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  prompt: string;
  createdAt: string;
  updatedAt: string;
}

const PROMPT_CATEGORIES = [
  'Microsoft 365',
  'Productivity', 
  'Notion',
  'Agents',
  'General'
];

interface FormData {
  title: string;
  description: string;
  category: string;
  tags: string;
  prompt: string;
}

export default function AdminPromptForm() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    tags: '',
    prompt: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Load prompts on component mount
  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/prompts/list');
      if (response.ok) {
        const data = await response.json();
        setPrompts(data.prompts);
      }
    } catch (error) {
      console.error('Failed to fetch prompts:', error);
      setMessage({ type: 'error', text: 'Failed to load prompts' });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    if (!formData.category) {
      errors.category = 'Category is required';
    }
    if (!formData.prompt.trim()) {
      errors.prompt = 'Prompt text is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    setValidationErrors({});
    
    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Please fix the validation errors below' });
      return;
    }
    
    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/prompts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Prompt created successfully!' });
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          category: '',
          tags: '',
          prompt: '',
        });
        
        setValidationErrors({});
        fetchPrompts(); // Refresh the list
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to create prompt' });
      }
    } catch (error) {
      console.error('Failed to create prompt:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch('/api/prompts/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Prompt deleted successfully!' });
        fetchPrompts(); // Refresh the list
        setDeleteConfirmId(null);
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Failed to delete prompt' });
      }
    } catch (error) {
      console.error('Failed to delete prompt:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    }
  };

  const handleCopyPrompt = async (promptText: string, title: string) => {
    try {
      await navigator.clipboard.writeText(promptText);
      setMessage({ type: 'success', text: `"${title}" copied to clipboard!` });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Failed to copy prompt:', error);
      setMessage({ type: 'error', text: 'Failed to copy prompt to clipboard' });
    }
  };

  return (
    <div className="bg-white rounded-2xl border p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        Prompt Management
      </h2>

      {/* Message Banner */}
      {message && (
        <div
          className={`p-4 rounded-lg mb-6 flex items-start gap-3 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1 text-sm">
            {message.text}
          </div>
          <button
            onClick={() => setMessage(null)}
            className="flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Create Prompt Form */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create New Prompt
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (validationErrors.title) {
                    setValidationErrors({ ...validationErrors, title: '' });
                  }
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  validationErrors.title 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'focus:ring-blue-500'
                }`}
                placeholder="E.g., Excel Formula Expert"
                required
              />
              {validationErrors.title && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => {
                  setFormData({ ...formData, category: e.target.value });
                  if (validationErrors.category) {
                    setValidationErrors({ ...validationErrors, category: '' });
                  }
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  validationErrors.category 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'focus:ring-blue-500'
                }`}
                required
              >
                <option value="">Select a category</option>
                {PROMPT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {validationErrors.category && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.category}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (validationErrors.description) {
                  setValidationErrors({ ...validationErrors, description: '' });
                }
              }}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                validationErrors.description 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'focus:ring-blue-500'
              }`}
              rows={3}
              placeholder="Brief description of what this prompt does..."
              required
            />
            {validationErrors.description && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., excel, formulas, data analysis"
            />
            <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
          </div>

          {/* Prompt Text */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Prompt Text <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.prompt}
              onChange={(e) => {
                setFormData({ ...formData, prompt: e.target.value });
                if (validationErrors.prompt) {
                  setValidationErrors({ ...validationErrors, prompt: '' });
                }
              }}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 font-mono text-sm ${
                validationErrors.prompt 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'focus:ring-blue-500'
              }`}
              rows={6}
              placeholder="Enter the full prompt text here..."
              required
            />
            {validationErrors.prompt && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.prompt}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
              submitting
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating Prompt...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Create Prompt
              </>
            )}
          </button>
        </form>
      </div>

      {/* Existing Prompts */}
      <div>
        <h3 className="text-lg font-medium mb-4">Existing Prompts ({prompts.length})</h3>

        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading prompts...</p>
          </div>
        ) : prompts.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No prompts created yet.</p>
            <p className="text-sm text-gray-400 mt-1">Create your first prompt using the form above.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {prompts.map((prompt) => (
              <div
                key={prompt._id}
                className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all bg-white"
              >
                <div className="flex gap-5">
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-lg text-gray-900">{prompt.title}</h4>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold">
                            {prompt.category}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                          {prompt.description}
                        </p>
                        
                        {prompt.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {prompt.tags.map((tag) => (
                              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-4 mt-2 text-xs text-gray-500">
                          <span>📅 {new Date(prompt.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCopyPrompt(prompt.prompt, prompt.title)}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition flex items-center gap-1"
                          title="Copy prompt to clipboard"
                        >
                          <Copy className="w-3 h-3" />
                          Copy
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(prompt._id)}
                          className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Delete Prompt</h2>
                  <p className="text-sm text-gray-600">This action cannot be undone.</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this prompt? This will permanently remove it from the database.
              </p>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete Prompt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
