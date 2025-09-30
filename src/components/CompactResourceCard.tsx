import Image from 'next/image';
import { Eye, Download } from 'lucide-react';

interface CompactResourceCardProps {
  id: string;
  title: string;
  coverImage: string;
  onOpen: () => void;
  onDownload: (id: string, title: string) => void;
}

export default function CompactResourceCard({
  id,
  title,
  coverImage,
  onOpen,
  onDownload
}: CompactResourceCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group">
      {/* Cover Image */}
      <div 
        className="relative w-full h-48 bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden cursor-pointer"
        onClick={onOpen}
      >
        <Image
          src={coverImage || '/images/default-cover.svg'}
          alt={`Cover for ${title}`}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw"
        />
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white rounded-full p-3 shadow-lg">
            <Eye className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title - Max 2 lines */}
        <h3 
          className="text-base font-bold mb-3 line-clamp-2 leading-snug text-gray-900 group-hover:text-blue-600 transition-colors cursor-pointer flex-1"
          onClick={onOpen}
        >
          {title}
        </h3>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* Open Button - Primary */}
          <button
            onClick={onOpen}
            className="flex-1 py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Open
          </button>

          {/* Download Icon - Secondary */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload(id, title);
            }}
            className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
            aria-label="Download resource"
            title="Download resource"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
