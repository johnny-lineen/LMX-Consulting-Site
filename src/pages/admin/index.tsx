import { useState, useEffect, FormEvent } from 'react';
import { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import AdminPromptForm from '@/components/admin/AdminPromptForm';
import { getCurrentUser } from '@/utils/auth';
import { connectDB } from '@/lib/mongodb';
import { User, IUser } from '@/models/User';
import { Upload, FileText, Image, X, Check, AlertCircle, FolderOpen, Download, Search, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

/**
 * Admin Dashboard - Main Admin Page
 * 
 * Design Decision: Consolidates all admin functionality into a single dashboard
 * with sections for Resources, Prompts, and Testimonials management.
 * Maintains consistency with existing admin styling and patterns.
 */

interface AdminDashboardProps {
  user: {
    id: string;
    email: string;
    name: string;
    isAdmin: boolean;
  };
}

interface Resource {
  _id: string;
  title: string;
  description: string;
  type: string;
  slug: string;
  category: string;
  fileUrl?: string;
  filePath: string;
  mainFile?: string;
  coverImage?: string;
  images?: string[];
  tags: string[];
  gated: boolean;
  status: 'draft' | 'live' | 'archived';
  createdAt: string;
  updatedAt: string;
}

// Use the mapping utility for consistent type handling
const RESOURCE_TYPES = [
  { value: 'notion', label: 'Notion Template' },
  { value: 'ebook', label: 'E-Book' },
  { value: 'cheatsheet', label: 'Cheat Sheet' },
  { value: 'video', label: 'Video' },
];

const RESOURCE_CATEGORIES = [
  'AI & Automation',
  'Productivity',
  'Education',
  'Business',
  'Marketing',
  'Design',
  'Development',
  'Writing',
  'Finance',
  'Health & Wellness',
  'Other'
];

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft (Hidden from public)' },
  { value: 'live', label: 'Live (Visible to public)' },
];

interface FormData {
  title: string;
  description: string;
  type: string;
  category: string;
  fileUrl: string;
  tags: string;
  file: File | null;
  coverImage: File | null;
  gated: boolean;
  status: string;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loadingResources, setLoadingResources] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Pending testimonials state
  const [pending, setPending] = useState<Array<{ _id: string; clientName: string; email: string; testimonial: string; rating?: number; source?: string; createdAt: string }>>([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [pendingSkip, setPendingSkip] = useState(0);
  const [pendingHasMore, setPendingHasMore] = useState(false);
  const [search, setSearch] = useState('');
  const [actionBusyId, setActionBusyId] = useState<string | null>(null);
  
  // New state for improved resource management
  const [resourceSearch, setResourceSearch] = useState('');
  const [resourceTypeFilter, setResourceTypeFilter] = useState<string>('all');
  const [resourceStatusFilter, setResourceStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    type: 'ebook',
    category: '',
    fileUrl: '',
    tags: '',
    file: null,
    coverImage: null,
    gated: false,
    status: 'draft',
  });

  // Client-side validation errors
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchResources();
    // initial pending fetch
    loadPending(true);
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/resources');
      if (response.ok) {
        const data = await response.json();
        setResources(data.resources);
      }
    } catch (error: unknown) {
      console.error('[ERROR]:', error instanceof Error ? error.message : String(error));
      if (error instanceof Error) console.error(error.stack);
    } finally {
      setLoadingResources(false);
    }
  };

  // --- Pending testimonials ---
  const loadPending = async (reset: boolean = false) => {
    try {
      setPendingLoading(true);
      const limit = 15;
      const skip = reset ? 0 : pendingSkip;
      const resp = await fetch(`/api/testimonials/list?status=pending&limit=${limit}&skip=${skip}`);
      const data = await resp.json();
      if (resp.ok) {
        const items = (data.items || []).map((d: any) => ({
          _id: String(d._id),
          clientName: String(d.clientName || ''),
          email: String(d.email || ''),
          testimonial: String(d.testimonial || ''),
          rating: typeof d.rating === 'number' ? d.rating : undefined,
          source: d.source ? String(d.source) : undefined,
          createdAt: d.createdAt
        }));
        setPending(reset ? items : [...pending, ...items]);
        setPendingTotal(typeof data.total === 'number' ? data.total : items.length);
        const next = typeof data.nextSkip === 'number' ? data.nextSkip : skip + items.length;
        setPendingSkip(next);
        setPendingHasMore(Boolean(data.nextSkip));
      }
    } catch (e) {
      // ignore
    } finally {
      setPendingLoading(false);
    }
  };

  // simple debounce for search input
  useEffect(() => {
    const t = setTimeout(() => {
      // no server filtering; client-side only
      // noop, state change triggers re-render
    }, 250);
    return () => clearTimeout(t);
  }, [search]);

  const filteredPending = pending.filter((p) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      p.clientName.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.testimonial.toLowerCase().includes(q)
    );
  });

  const approvePending = async (id: string) => {
    try {
      setActionBusyId(id);
      // optimistic remove
      const prev = pending;
      setPending(prev.filter((p) => p._id !== id));
      const resp = await fetch('/api/testimonials/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testimonialId: id, status: 'approved' })
      });
      if (!resp.ok) {
        // restore on failure
        setPending(prev);
        alert('Failed to approve testimonial');
      }
    } catch (e) {
      alert('Failed to approve testimonial');
    } finally {
      setActionBusyId(null);
    }
  };

  const deletePending = async (id: string) => {
    if (!confirm("Delete this testimonial? This can't be undone.")) return;
    try {
      setActionBusyId(id);
      const prev = pending;
      setPending(prev.filter((p) => p._id !== id));
      const resp = await fetch('/api/testimonials/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testimonialId: id })
      });
      if (!resp.ok) {
        setPending(prev);
        alert('Failed to delete testimonial');
      }
    } catch (e) {
      alert('Failed to delete testimonial');
    } finally {
      setActionBusyId(null);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Required field validation
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    if (!formData.category) {
      errors.category = 'Category is required';
    }
    
    // Type-specific validation with clean error messages
    if (formData.type === 'notion') {
      if (!formData.fileUrl.trim()) {
        errors.fileUrl = 'Notion templates must include a valid Notion link.';
      } else if (!formData.fileUrl.includes('notion.so') && !formData.fileUrl.includes('notion.site')) {
        errors.fileUrl = 'Notion templates must include a valid Notion link.';
      }
    } else if (formData.type === 'ebook') {
      if (!formData.fileUrl.trim()) {
        errors.fileUrl = 'Ebooks must include a valid PDF link.';
      } else if (!formData.fileUrl.endsWith('.pdf') && !formData.fileUrl.includes('.pdf')) {
        errors.fileUrl = 'Ebooks must include a valid PDF link.';
      }
    } else if (['cheatsheet', 'video'].includes(formData.type)) {
      // For cheatsheet and video, require either fileUrl or file upload
      if (!formData.fileUrl.trim() && !formData.file) {
        errors.fileUrl = 'Either file URL or file upload is required';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Clear previous validation errors
    setValidationErrors({});
    
    // Client-side validation
    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Please fix the validation errors below' });
      return;
    }
    
    setUploading(true);
    setMessage(null);

    try {
      // Regular file upload or URL-based resource
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('fileUrl', formData.fileUrl);
      formDataToSend.append('tags', formData.tags);
      formDataToSend.append('gated', formData.gated.toString());
      formDataToSend.append('status', formData.status);
      
      if (formData.file) {
        formDataToSend.append('file', formData.file);
      }
      if (formData.coverImage) {
        formDataToSend.append('coverImage', formData.coverImage);
      }

      const response = await fetch('/api/resources/create', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Resource uploaded successfully!' });
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          type: 'ebook',
          category: '',
          fileUrl: '',
          tags: '',
          file: null,
          coverImage: null,
          gated: false,
          status: 'draft',
        });
        
        // Clear validation errors
        setValidationErrors({});
        
        // Reset file inputs
        const fileInput = document.querySelector<HTMLInputElement>('#file-input');
        const coverInput = document.querySelector<HTMLInputElement>('#cover-input');
        if (fileInput) fileInput.value = '';
        if (coverInput) coverInput.value = '';
        
        // Refresh resources list
        fetchResources();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to upload resource' });
      }
    } catch (error: unknown) {
      console.error('[ERROR]:', error instanceof Error ? error.message : String(error));
      if (error instanceof Error) console.error(error.stack);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/resources/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Resource deleted successfully!' });
        fetchResources();
        setDeleteConfirmId(null); // Close confirmation modal
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Failed to delete resource' });
      }
    } catch (error: unknown) {
      console.error('[ERROR]:', error instanceof Error ? error.message : String(error));
      if (error instanceof Error) console.error(error.stack);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'draft' | 'live' | 'archived') => {
    try {
      const response = await fetch(`/api/resources/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setResources(prev => 
          prev.map(r => r._id === id ? { ...r, status: newStatus } : r)
        );
        setMessage({ type: 'success', text: `Resource status updated to ${newStatus}` });
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Failed to update status' });
      }
    } catch (error: unknown) {
      console.error('[ERROR]:', error instanceof Error ? error.message : String(error));
      if (error instanceof Error) console.error(error.stack);
      setMessage({ type: 'error', text: 'Failed to update status' });
    }
  };

  // Filter and paginate resources
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(resourceSearch.toLowerCase()) ||
                         resource.description.toLowerCase().includes(resourceSearch.toLowerCase());
    const matchesType = resourceTypeFilter === 'all' || resource.type === resourceTypeFilter;
    const matchesStatus = resourceStatusFilter === 'all' || resource.status === resourceStatusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResources = filteredResources.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [resourceSearch, resourceTypeFilter, resourceStatusFilter]);

  return (
    <Layout title="Admin Dashboard" description="Administrative Panel">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted mt-2">
            Welcome, {user.name}. Manage resources, prompts, and testimonials.
          </p>
        </div>

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
            <div className="flex-1 whitespace-pre-line text-sm">
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

        {/* Pending Testimonials */}
        <div className="bg-white rounded-2xl border p-5 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Pending Testimonials</h2>
              <p className="text-sm text-gray-600">Approve or delete recent submissions.</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, or text..."
                className="px-3 py-2 border rounded-lg text-sm w-64"
              />
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">Pending: {filteredPending.length}{pendingLoading ? '…' : ''}</span>
            </div>
          </div>

          {pendingLoading && pending.length === 0 ? (
            <div className="text-center py-10 text-sm text-gray-500">Loading pending testimonials…</div>
          ) : filteredPending.length === 0 ? (
            <div className="border rounded-xl p-6 mt-4 text-center text-sm text-gray-600">No pending testimonials. New submissions will appear here.</div>
          ) : (
            <div className="mt-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredPending.map((t) => {
                const quote = (t.testimonial || '').toString().trim();
                const isQuoted = quote.startsWith('"') || quote.startsWith('"');
                const display = isQuoted ? quote : `"${quote}"`;
                return (
                  <div key={t._id} className="rounded-2xl border p-5 shadow-sm bg-white">
                    <p className="text-sm text-gray-800 line-clamp-4">{display}</p>
                    <div className="mt-3 text-xs text-gray-600">
                      <div className="font-medium text-gray-800">{t.clientName} <span className="text-gray-500">&lt;{t.email}&gt;</span></div>
                      {typeof t.rating === 'number' && (
                        <div className="mt-1" aria-label={`Rating ${t.rating} of 5`}>
                          {'★★★★★'.slice(0, t.rating)}{'☆☆☆☆☆'.slice(0, Math.max(0, 5 - t.rating))}
                        </div>
                      )}
                      {t.source && <div className="mt-1">{t.source}</div>}
                      <div className="mt-1 text-gray-500">Submitted {new Date(t.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:justify-end">
                      <button
                        onClick={() => approvePending(t._id)}
                        disabled={actionBusyId === t._id}
                        className={`px-4 py-2 rounded-lg text-white ${actionBusyId === t._id ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
                      >
                        {actionBusyId === t._id ? 'Approving…' : 'Approve'}
                      </button>
                      <button
                        onClick={() => deletePending(t._id)}
                        disabled={actionBusyId === t._id}
                        className={`px-4 py-2 rounded-lg border ${actionBusyId === t._id ? 'border-red-200 text-red-300' : 'border-red-300 text-red-700 hover:bg-red-50'}`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {pendingHasMore && (
            <div className="mt-4 text-center">
              <button onClick={() => loadPending(false)} disabled={pendingLoading} className={`px-4 py-2 rounded-lg border ${pendingLoading ? 'bg-gray-100 text-gray-400' : 'hover:bg-gray-50'}`}>
                {pendingLoading ? 'Loading…' : 'Load more'}
              </button>
            </div>
          )}
        </div>

        {/* Prompt Management Section */}
        <div className="mb-8">
          <AdminPromptForm />
        </div>

        {/* Resource Management Section */}
        <div className="bg-white rounded-2xl border p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Resource Management</h2>
          
          {/* Quick Resource Upload Form */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Quick Upload</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title *</label>
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
                    placeholder="E.g., AI for Faculty Starter Kit"
                    required
                  />
                  {validationErrors.title && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => {
                      setFormData({ ...formData, type: e.target.value });
                      if (validationErrors.fileUrl) {
                        setValidationErrors({ ...validationErrors, fileUrl: '' });
                      }
                    }}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {RESOURCE_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category *</label>
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
                    {RESOURCE_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {validationErrors.category && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.category}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
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
                  placeholder="Describe what this resource includes and who it's for..."
                  required
                />
                {validationErrors.description && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  File URL {['notion', 'ebook'].includes(formData.type) && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="url"
                  value={formData.fileUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, fileUrl: e.target.value });
                    if (validationErrors.fileUrl) {
                      setValidationErrors({ ...validationErrors, fileUrl: '' });
                    }
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    validationErrors.fileUrl 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'focus:ring-blue-500'
                  }`}
                  placeholder={
                    formData.type === 'notion' 
                      ? 'https://notion.so/your-template... or https://workspace.notion.site/page...' 
                      : formData.type === 'ebook'
                      ? 'https://example.com/ebook.pdf'
                      : 'https://example.com/resource.pdf or upload file below'
                  }
                  required={['notion', 'ebook'].includes(formData.type)}
                />
                {validationErrors.fileUrl && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.fileUrl}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., AI, automation, productivity, education"
                />
                <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
              </div>

              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.gated}
                    onChange={(e) => setFormData({ ...formData, gated: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium">
                    Require email capture before access
                  </span>
                </label>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <FileText className="w-4 h-4 inline mr-1" />
                    Resource File (Optional)
                  </label>
                  <input
                    id="file-input"
                    type="file"
                    onChange={(e) => {
                      setFormData({ ...formData, file: e.target.files?.[0] || null });
                      if (validationErrors.fileUrl) {
                        setValidationErrors({ ...validationErrors, fileUrl: '' });
                      }
                    }}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload a file OR use File URL above. PDF, DOCX, XLSX, ZIP, etc. (Max 50MB)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    <Image className="w-4 h-4 inline mr-1" />
                    Cover Image (optional)
                  </label>
                  <input
                    id="cover-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.files?.[0] || null })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG, WebP (recommended 800x600px)
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                  uploading
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {uploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Resource...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Create Resource
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Resources List */}
          <div>
            <h3 className="text-lg font-medium mb-4">Existing Resources ({resources.length})</h3>

            {loadingResources ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-gray-500 mt-4">Loading resources...</p>
              </div>
            ) : (
              <>
                {/* Resource Management Controls */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                  <div className="flex flex-col lg:flex-row gap-4 mb-4">
                    {/* Search */}
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search resources by title or description..."
                          value={resourceSearch}
                          onChange={(e) => setResourceSearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Type Filter */}
                    <div className="lg:w-48">
                      <select
                        value={resourceTypeFilter}
                        onChange={(e) => setResourceTypeFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Types</option>
                        <option value="notion">Notion Template</option>
                        <option value="ebook">E-Book</option>
                        <option value="cheatsheet">Cheat Sheet</option>
                        <option value="video">Video</option>
                        <option value="scanned">Scanned</option>
                      </select>
                    </div>

                    {/* Status Filter */}
                    <div className="lg:w-48">
                      <select
                        value={resourceStatusFilter}
                        onChange={(e) => setResourceStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Status</option>
                        <option value="draft">Draft</option>
                        <option value="live">Live</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  {/* Results Summary */}
                  <div className="text-sm text-gray-600">
                    Showing {paginatedResources.length} of {filteredResources.length} resources
                    {filteredResources.length !== resources.length && (
                      <span className="text-blue-600 ml-2">
                        (filtered from {resources.length} total)
                      </span>
                    )}
                  </div>
                </div>

                {/* Resources List */}
                {filteredResources.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                      {resources.length === 0 
                        ? 'No resources uploaded yet.' 
                        : 'No resources match your current filters.'
                      }
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {resources.length === 0 
                        ? 'Upload your first resource using the form above.' 
                        : 'Try adjusting your search or filter criteria.'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paginatedResources.map((resource) => (
                      <div
                        key={resource._id}
                        className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all bg-white"
                      >
                        <div className="flex gap-5">
                          {/* Cover Image Preview */}
                          <div className="flex-shrink-0">
                            <div className="relative w-32 h-24 rounded-lg overflow-hidden border-2 border-gray-200">
                              <img
                                src={resource.coverImage || '/images/default-cover.svg'}
                                alt={resource.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/images/default-cover.svg';
                                }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1 text-center">
                              {resource.coverImage?.includes('default') ? 'Placeholder' : 'Custom Cover'}
                            </p>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-bold text-lg">{resource.title}</h3>
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold">
                                    {RESOURCE_TYPES.find(t => t.value === resource.type)?.label || resource.type}
                                  </span>
                                  {resource.gated && (
                                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-semibold">
                                      Gated
                                    </span>
                                  )}
                                </div>
                                
                                <p className="text-sm text-gray-700 mt-2 leading-relaxed line-clamp-2">
                                  {resource.description}
                                </p>
                                
                                {resource.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {resource.tags.map((tag) => (
                                      <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                        #{tag}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                                  <span>📄 {resource.mainFile?.split('/').pop() || resource.fileUrl || 'No file'}</span>
                                  <span>📅 {new Date(resource.createdAt).toLocaleDateString()}</span>
                                  <span>📂 {resource.category}</span>
                                </div>
                              </div>

                              {/* Status and Actions */}
                              <div className="flex flex-col gap-2">
                                {/* Status Dropdown */}
                                <select
                                  value={resource.status}
                                  onChange={(e) => handleStatusChange(resource._id, e.target.value as 'draft' | 'live' | 'archived')}
                                  className="px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                  <option value="draft">Draft</option>
                                  <option value="live">Live</option>
                                  <option value="archived">Archived</option>
                                </select>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                  <a
                                    href={resource.fileUrl || `/api/resources/download/${resource._id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition whitespace-nowrap flex items-center gap-1"
                                  >
                                    {resource.type === 'notion' ? (
                                      <>
                                        <Eye className="w-3 h-3" />
                                        Open
                                      </>
                                    ) : (
                                      <>
                                        <Download className="w-3 h-3" />
                                        Download
                                      </>
                                    )}
                                  </a>
                                  <button
                                    onClick={() => setDeleteConfirmId(resource._id)}
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
                      </div>
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-600">
                          Page {currentPage} of {totalPages}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Previous
                          </button>
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                            if (pageNum > totalPages) return null;
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`px-3 py-1 text-sm border rounded ${
                                  currentPage === pageNum
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                          <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
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
                  <h2 className="text-xl font-bold text-gray-900">Delete Resource</h2>
                  <p className="text-sm text-gray-600">This action cannot be undone.</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this resource? This will permanently remove it from the database.
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
                  Delete Resource
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const currentUser = getCurrentUser(context.req as any);
    
    if (!currentUser) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    await connectDB();
    const user = await User.findById(currentUser.userId).lean<IUser | null>();

    if (!user || !user.isAdmin) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    return {
      props: {
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
        },
      },
    };
  } catch (error: unknown) {
    console.error('[ERROR]:', error instanceof Error ? error.message : String(error));
    if (error instanceof Error) console.error(error.stack);
    
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
};
