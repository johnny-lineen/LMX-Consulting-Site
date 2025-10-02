import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, Download, Tag, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { PublicResource, RESOURCE_TYPE_LABELS, RESOURCE_BUTTON_TEXT } from '@/types/resource';
import { createCardClass, createButtonClass, cn } from '@/lib/themeUtils';

interface Resource extends PublicResource {
  mainFile?: string;
  images?: string[];
}

interface ResourceModalProps {
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (resourceId: string, title: string) => void;
}

// Resource type labels are now imported from types/resource.ts

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
        className={createCardClass({ shadow: 'xl', additionalClasses: 'relative rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto' })}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-bg-muted hover:bg-bg-secondary transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-text-secondary" />
        </button>

        {/* Cover Image with Gallery */}
        <div className="relative w-full h-80 bg-gradient-to-br from-bg-secondary to-purple-50 overflow-hidden rounded-t-xl">
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
            <div className="absolute top-4 left-4 bg-black bg-opacity-60 text-text-inverse text-sm px-3 py-1.5 rounded-full">
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
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-bg-primary bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-lg transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 text-text-primary" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-bg-primary bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-lg transition-all"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 text-text-primary" />
              </button>
            </>
          )}
        </div>
        
        {/* Thumbnail Gallery */}
        {hasMultipleImages && (
          <div className="px-6 pt-4 pb-2 bg-bg-secondary border-b border-border-muted">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={cn(
                    'relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all',
                    index === selectedImageIndex
                      ? 'border-brand-primary shadow-md scale-105'
                      : 'border-border-secondary hover:border-brand-primary opacity-70 hover:opacity-100'
                  )}
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
          {/* Type Badge and Category */}
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="inline-block text-sm font-semibold bg-brand-primary/10 text-brand-primary px-3 py-1.5 rounded-lg">
              {RESOURCE_TYPE_LABELS[resource.type] || resource.type}
            </span>
            <span className="inline-block text-sm font-semibold bg-brand-secondary/10 text-brand-secondary px-3 py-1.5 rounded-lg">
              {resource.category}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
            {resource.title}
          </h2>

          {/* Description */}
          <p className="text-text-primary leading-relaxed mb-6">
            {resource.description}
          </p>

          {/* Tags */}
          {resource.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-text-secondary" />
                <h3 className="text-sm font-semibold text-text-primary">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm bg-bg-muted text-text-secondary px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-2 mb-6 text-sm text-text-secondary">
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
            className="w-full py-4 px-6 bg-gradient-to-r from-brand-primary to-brand-secondary text-text-inverse text-lg font-semibold rounded-xl hover:from-interactive-hover hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          >
            <Download className="w-6 h-6" />
            {RESOURCE_BUTTON_TEXT[resource.type] || 'Download Resource'}
          </button>
        </div>
      </div>
    </div>
  );
}
