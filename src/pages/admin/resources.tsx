import { useState, useEffect, FormEvent } from 'react';
import { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import { getCurrentUser } from '@/utils/auth';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Upload, FileText, Image, X, Check, AlertCircle, FolderOpen, Download } from 'lucide-react';

interface AdminResourcesProps {
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
  filePath: string;
  coverImage?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface ScannedFile {
  fileName: string;
  type: string;
  suggestedTitle: string;
  filePath: string;
  coverImage?: string;
  fileSize: number;
}

const RESOURCE_TYPES = [
  { value: 'ebook', label: 'E-Book' },
  { value: 'checklist', label: 'Checklist' },
  { value: 'notion-template', label: 'Notion Template' },
  { value: 'guide', label: 'Guide' },
  { value: 'toolkit', label: 'Toolkit' },
  { value: 'other', label: 'Other' },
];

export default function AdminResourcesPage({ user }: AdminResourcesProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loadingResources, setLoadingResources] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'ebook',
    tags: '',
    file: null as File | null,
    coverImage: null as File | null,
  });

  // Import from folder state
  const [scanning, setScanning] = useState(false);
  const [scannedFiles, setScannedFiles] = useState<ScannedFile[]>([]);
  const [showScanResults, setShowScanResults] = useState(false);
  const [importing, setImporting] = useState(false);
  const [organizing, setOrganizing] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/resources');
      if (response.ok) {
        const data = await response.json();
        setResources(data.resources);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoadingResources(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // @ts-ignore - Check for server import mode
    const isServerImport = formData._isServerImport;
    
    if (!isServerImport && !formData.file) {
      setMessage({ type: 'error', text: 'Please select a file to upload or import from folder' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      let response;
      let data;

      if (isServerImport) {
        // Server-side import from scanned folder
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('type', formData.type);
        formDataToSend.append('tags', formData.tags);
        // @ts-ignore
        formDataToSend.append('sourceFilePath', formData._sourceFilePath);
        // @ts-ignore
        if (formData._sourceCoverPath) {
          // @ts-ignore
          formDataToSend.append('sourceCoverPath', formData._sourceCoverPath);
        }

        response = await fetch('/api/resources/import', {
          method: 'POST',
          body: formDataToSend,
        });
        
        data = await response.json();
      } else {
        // Regular file upload
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('type', formData.type);
        formDataToSend.append('tags', formData.tags);
        formDataToSend.append('file', formData.file!);
        
        if (formData.coverImage) {
          formDataToSend.append('coverImage', formData.coverImage);
        }

        response = await fetch('/api/resources/upload', {
          method: 'POST',
          body: formDataToSend,
        });

        data = await response.json();
      }

      if (response.ok) {
        setMessage({ type: 'success', text: `Resource ${isServerImport ? 'imported' : 'uploaded'} successfully!` });
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          type: 'ebook',
          tags: '',
          file: null,
          coverImage: null,
        });
        
        // Reset file inputs
        const fileInput = document.querySelector<HTMLInputElement>('#file-input');
        const coverInput = document.querySelector<HTMLInputElement>('#cover-input');
        if (fileInput) fileInput.value = '';
        if (coverInput) coverInput.value = '';
        
        // Refresh resources list
        fetchResources();
      } else {
        setMessage({ type: 'error', text: data.error || `Failed to ${isServerImport ? 'import' : 'upload'} resource` });
      }
    } catch (error) {
      console.error('Submit error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) {
      return;
    }

    try {
      const response = await fetch(`/api/resources/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Resource deleted successfully!' });
        fetchResources();
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Failed to delete resource' });
      }
    } catch (error) {
      console.error('Delete error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    }
  };

  const handleImportZips = async () => {
    setScanning(true);
    setMessage(null);

    try {
      const response = await fetch('/api/resources/import-zips', {
        method: 'POST',
      });
      const data = await response.json();

      if (response.ok) {
        if (data.imported === 0 && data.skipped === 0) {
          setMessage({ 
            type: 'error', 
            text: `No ZIP files found in desktop import folder.\n\nPlace ZIP files in: ${process.env.RESOURCE_IMPORT_PATH || 'Desktop/resources'}`
          });
        } else if (data.imported === 0 && data.skipped > 0) {
          setMessage({ 
            type: 'error', 
            text: `No new resources imported. ${data.skipped} ZIP(s) skipped (already imported or invalid).`
          });
        } else {
          setMessage({ 
            type: 'success', 
            text: data.message || `Successfully imported ${data.imported} resource(s) from ZIP files!${data.skipped > 0 ? `\n\n${data.skipped} ZIP(s) skipped.` : ''}\n\nFiles copied to /public/resources/ with relative paths.`
          });
          
          // Refresh resources list
          fetchResources();
        }
      } else {
        let errorMessage = data.error || 'Failed to import ZIPs';
        
        if (data.details) {
          errorMessage += `\n\nDetails: ${data.details}`;
        }
        
        if (data.suggestion) {
          errorMessage += `\n\n💡 ${data.suggestion}`;
        }
        
        console.error('Import failed:', data);
        setMessage({ type: 'error', text: errorMessage });
      }
    } catch (error) {
      console.error('Import error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setScanning(false);
    }
  };

  const handleSelectScannedFile = (scannedFile: ScannedFile) => {
    // Auto-fill form with scanned file data
    setFormData({
      title: scannedFile.suggestedTitle,
      description: '', // Leave empty for admin to fill
      type: scannedFile.type,
      tags: '', // Leave empty for admin to fill
      file: null, // Will be set via sourceFilePath in backend
      coverImage: null, // Will be set via sourceCoverPath in backend
    });

    // Store source paths for server-side import
    setFormData(prev => ({
      ...prev,
      // @ts-ignore - Adding custom fields for server import
      _sourceFilePath: scannedFile.filePath,
      _sourceCoverPath: scannedFile.coverImage,
      _isServerImport: true,
    }));

    // Close scan results and scroll to form
    setShowScanResults(false);
    setMessage({ 
      type: 'success', 
      text: `Pre-filled form with: ${scannedFile.suggestedTitle}. Please review and add description/tags.` 
    });

    // Scroll to form
    setTimeout(() => {
      document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleOrganizeImport = async () => {
    setOrganizing(true);
    setMessage(null);

    try {
      const response = await fetch('/api/resources/organize', {
        method: 'POST',
      });
      const data = await response.json();

      if (response.ok) {
        const successMsg = `Organized ${data.processed} resource(s) from import folder. ${
          data.failed > 0 ? `${data.failed} failed.` : ''
        }`;
        
        setMessage({ 
          type: 'success', 
          text: successMsg + '\n\nYou can now use "Import from Folder" to scan the organized resources.' 
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: data.error || 'Failed to organize import folder' 
        });
      }
    } catch (error) {
      console.error('Organize error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setOrganizing(false);
    }
  };

  return (
    <Layout title="Admin Panel" description="Resource Management">
      <div className="container-px max-w-7xl mx-auto py-12 md:py-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Resource Management</h1>
          <p className="text-muted mt-2">
            Welcome, {user.name}. Upload and manage resources for your users.
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

        {/* Import Management Buttons */}
        <div className="mb-6">
          <button
            onClick={handleImportZips}
            disabled={scanning}
            className={`px-8 py-4 rounded-lg font-semibold transition flex items-center gap-3 text-lg ${
              scanning
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg'
            }`}
            title="Import ZIP files from desktop folder - extracts and copies to /public/resources"
          >
            {scanning ? (
              <>
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing ZIPs...
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Import ZIP Files from Desktop
              </>
            )}
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-5 mb-6 text-sm">
          <p className="font-bold text-blue-900 mb-3 text-base">📦 How to Import Resources:</p>
          <div className="space-y-3 text-blue-800">
            <div className="bg-white bg-opacity-60 rounded-lg p-3">
              <p className="font-semibold mb-1">1️⃣ Download Your Resources</p>
              <p className="text-xs">Save ZIP files to: <code className="bg-blue-100 px-1 py-0.5 rounded">Desktop/resources</code></p>
            </div>
            <div className="bg-white bg-opacity-60 rounded-lg p-3">
              <p className="font-semibold mb-1">2️⃣ Click "Import ZIP Files from Desktop"</p>
              <p className="text-xs">System will extract, organize, and copy to <code className="bg-blue-100 px-1 py-0.5 rounded">/public/resources</code></p>
            </div>
            <div className="bg-white bg-opacity-60 rounded-lg p-3">
              <p className="font-semibold mb-1">3️⃣ Resources Auto-Imported</p>
              <p className="text-xs">Files copied with relative paths, covers detected, metadata generated ✨</p>
            </div>
            <div className="text-xs text-blue-700 mt-2 bg-white bg-opacity-40 rounded p-2">
              <strong>Alternative:</strong> Use manual upload form below for individual files
            </div>
          </div>
        </div>

        {/* Scan Results Modal */}
        {showScanResults && scannedFiles.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <FolderOpen className="w-6 h-6" />
                    Select File to Import ({scannedFiles.length})
                  </h2>
                  <button
                    onClick={() => setShowScanResults(false)}
                    className="text-gray-500 hover:text-gray-700 p-2"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Click on a file to pre-fill the upload form with its metadata
                </p>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto p-6 flex-1">
                <div className="space-y-3">
                  {scannedFiles.map((file, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectScannedFile(file)}
                      className="w-full bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-purple-500 hover:bg-purple-50 transition text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{file.suggestedTitle}</h3>
                          <p className="text-sm text-gray-600 mt-1">{file.fileName}</p>
                          <div className="flex gap-2 mt-3">
                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded font-medium">
                              {RESOURCE_TYPES.find(t => t.value === file.type)?.label || file.type}
                            </span>
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                            </span>
                            {file.coverImage && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded flex items-center gap-1">
                                <Image className="w-3 h-3" />
                                Has Cover
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="ml-4 text-purple-600">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t bg-gray-50">
                <p className="text-sm text-gray-600 text-center">
                  📁 Scanning from: <code className="text-xs bg-gray-200 px-2 py-1 rounded">
                    {process.env.RESOURCE_IMPORT_PATH || 'C:/Users/jline/Desktop/Resources'}
                  </code>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Form */}
        <div className="bg-white rounded-2xl border p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload New Resource
          </h2>
          
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
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="E.g., AI for Faculty Starter Kit"
                  required
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Describe what this resource includes and who it's for..."
                required
              />
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
                placeholder="e.g., AI, automation, productivity, education"
              />
              <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Main File */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Resource File {/* @ts-ignore */}
                  {!formData._isServerImport && <span className="text-red-500">*</span>}
                  {/* @ts-ignore */}
                  {formData._isServerImport && (
                    <span className="text-xs text-green-600 ml-2">(From import folder)</span>
                  )}
                </label>
                {/* @ts-ignore */}
                {formData._isServerImport ? (
                  <div className="w-full px-4 py-2 border border-green-200 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800 flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      {/* @ts-ignore */}
                      File: {formData._sourceFilePath?.split('/').pop() || 'Selected from folder'}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => {
                          const newData = { ...prev };
                          // @ts-ignore
                          delete newData._sourceFilePath;
                          // @ts-ignore
                          delete newData._sourceCoverPath;
                          // @ts-ignore
                          delete newData._isServerImport;
                          return newData;
                        });
                      }}
                      className="text-xs text-red-600 hover:text-red-800 mt-1"
                    >
                      Clear and upload file manually
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      id="file-input"
                      type="file"
                      onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, DOCX, XLSX, ZIP, etc. (Max 50MB)
                    </p>
                  </>
                )}
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  <Image className="w-4 h-4 inline mr-1" />
                  Cover Image (optional)
                  {/* @ts-ignore */}
                  {formData._sourceCoverPath && (
                    <span className="text-xs text-green-600 ml-2">(From import folder)</span>
                  )}
                </label>
                {/* @ts-ignore */}
                {formData._sourceCoverPath ? (
                  <div className="w-full px-4 py-2 border border-green-200 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800 flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      {/* @ts-ignore */}
                      Cover: {formData._sourceCoverPath?.split('/').pop() || 'Auto-detected'}
                    </p>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>

            {/* Submit Button */}
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
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload Resource
                </>
              )}
            </button>
          </form>
        </div>

        {/* Resources List */}
        <div className="bg-white rounded-2xl border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Existing Resources ({resources.length})</h2>

          {loadingResources ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-gray-500 mt-4">Loading resources...</p>
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No resources uploaded yet.</p>
              <p className="text-sm text-gray-400 mt-1">Upload your first resource using the form above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {resources.map((resource) => (
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
                            <span>📄 {resource.mainFile?.split('/').pop() || 'No file'}</span>
                            <span>📅 {new Date(resource.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                          <a
                            href={`/api/resources/download/${resource._id}`}
                            className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition whitespace-nowrap text-center"
                          >
                            Download
                          </a>
                          <button
                            onClick={() => handleDelete(resource._id)}
                            className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
                          >
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
      </div>
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
    const user = await User.findById(currentUser.userId).lean();

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
  } catch (error) {
    console.error('Admin page SSR error:', error);
    
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
};