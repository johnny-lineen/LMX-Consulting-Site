import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, Download, Tag, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  slug: string;
  mainFile?: string;
  coverImage: string;
  images?: string[];
  tags: string[];
  createdAt: string;
}

interface ResourceModalProps {
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (resourceId: string, title: string) => void;
}

const RESOURCE_TYPE_LABELS: Record<string, string> = {
  'ebook': 'E-Book',
  'checklist': 'Checklist',
  'guide': 'Guide',
  'notion-template': 'Notion Template',
  'toolkit': 'Toolkit',
  'other': 'Other',
};

export default function ResourceModal({ resource, isOpen, onClose, onDownload }: ResourceModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Get all images (use images array if available, otherwise just cover)
  const allImages = resource?.images && resource.images.length > 0 
    ? resource.images 
    : resource?.coverImage 
    ? [resource.coverImage] 
    : [];

  const currentImage = allImages[selectedImageIndex] || resource?.coverImage || '/images/default-cover.svg';
  const hasMultipleImages = allImages.length > 1;

  // Reset selected image when resource changes
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [resource?.id]);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !resource) return null;

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Cover Image with Gallery */}
        <div className="relative w-full h-80 bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden rounded-t-xl">
          <Image
            src={currentImage}
            alt={`Image ${selectedImageIndex + 1} of ${resource.title}`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 672px"
            priority
          />
          
          {/* Image Counter */}
          {hasMultipleImages && (
            <div className="absolute top-4 left-4 bg-black bg-opacity-60 text-white text-sm px-3 py-1.5 rounded-full">
              {selectedImageIndex + 1} / {allImages.length}
            </div>
          )}
          
          {/* Navigation Arrows */}
          {hasMultipleImages && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-lg transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-lg transition-all"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>
            </>
          )}
        </div>
        
        {/* Thumbnail Gallery */}
        {hasMultipleImages && (
          <div className="px-6 pt-4 pb-2 bg-gray-50 border-b">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === selectedImageIndex
                      ? 'border-blue-600 shadow-md scale-105'
                      : 'border-gray-300 hover:border-blue-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Type Badge */}
          <div className="mb-4">
            <span className="inline-block text-sm font-semibold bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg">
              {RESOURCE_TYPE_LABELS[resource.type] || resource.type}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {resource.title}
          </h2>

          {/* Description */}
          <p className="text-gray-700 leading-relaxed mb-6">
            {resource.description}
          </p>

          {/* Tags */}
          {resource.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-700">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Added {new Date(resource.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>

          {/* Download Button */}
          <button
            onClick={() => onDownload(resource.id, resource.title)}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          >
            <Download className="w-6 h-6" />
            Download Resource
          </button>
        </div>
      </div>
    </div>
  );
}
