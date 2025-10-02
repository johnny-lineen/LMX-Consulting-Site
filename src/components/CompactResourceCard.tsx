import Image from 'next/image';
import { Eye, Download, ExternalLink, Lock } from 'lucide-react';
import { RESOURCE_BUTTON_TEXT, RESOURCE_TYPE_LABELS } from '@/types/resource';
import { createCardClass, createButtonClass, cn } from '@/lib/themeUtils';

interface CompactResourceCardProps {
  id: string;
  title: string;
  coverImage: string;
  type: 'notion' | 'ebook' | 'cheatsheet' | 'video' | 'scanned';
  gated: boolean;
  onOpen: () => void;
  onDownload: (id: string, title: string) => void;
}

export default function CompactResourceCard({
  id,
  title,
  coverImage,
  type,
  gated,
  onOpen,
  onDownload
}: CompactResourceCardProps) {
  return (
    <div className={createCardClass({ 
      shadow: 'md', 
      interactive: true, 
      additionalClasses: 'overflow-hidden flex flex-col group duration-300' 
    })}>
      {/* Cover Image */}
      <div 
        className="relative w-full h-48 bg-gradient-to-br from-bg-secondary to-purple-50 overflow-hidden cursor-pointer"
        onClick={onOpen}
      >
        {/* Type Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-bg-primary/90 backdrop-blur-sm text-text-primary shadow-sm border border-border-primary/50">
            {RESOURCE_TYPE_LABELS[type] || type}
          </span>
        </div>

        <Image
          src={coverImage || '/images/default-cover.svg'}
          alt={`Cover for ${title}`}
          fill
          className="object-contain group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-bg-primary rounded-full p-3 shadow-lg">
            <Eye className="w-6 h-6 text-brand-primary" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title - Max 2 lines */}
        <h3 
          className="text-base font-bold mb-3 line-clamp-2 leading-snug text-text-primary group-hover:text-brand-primary transition-colors cursor-pointer flex-1"
          onClick={onOpen}
        >
          {title}
        </h3>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* Primary Action Button - Type-specific */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload(id, title);
            }}
            className={cn(
              'flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2',
              gated 
                ? 'bg-gradient-to-r from-brand-secondary to-pink-600 text-text-inverse hover:from-purple-700 hover:to-pink-700'
                : 'bg-brand-primary text-text-inverse hover:bg-interactive-hover'
            )}
          >
            {gated ? (
              <>
                <Lock className="w-4 h-4" />
                Get Access
              </>
            ) : (
              <>
                {type === 'notion' ? (
                  <ExternalLink className="w-4 h-4" />
                ) : type === 'video' ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {RESOURCE_BUTTON_TEXT[type] || 'Open'}
              </>
            )}
          </button>

          {/* Preview Button - Secondary */}
          <button
            onClick={onOpen}
            className="p-2 bg-bg-muted text-text-secondary rounded-lg hover:bg-bg-secondary transition-colors flex items-center justify-center"
            aria-label="Preview resource"
            title="Preview resource"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
