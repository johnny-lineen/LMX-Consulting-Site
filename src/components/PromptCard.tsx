import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

/**
 * PromptCard Component - Displays individual prompt information
 * 
 * Design Decision: Matches the homepage card styling with consistent
 * branding, typography, and spacing. Includes copy functionality with
 * visual feedback for better UX.
 */
interface PromptCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  prompt: string;
  onCopy?: () => void;
}

export default function PromptCard({ 
  id, 
  title, 
  description, 
  category, 
  tags, 
  prompt,
  onCopy 
}: PromptCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      onCopy?.();
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy prompt:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = prompt;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-6 rounded-2xl border border-border-primary shadow-soft bg-bg-secondary hover:shadow-brand transition-all duration-300 group">
      {/* Header */}
      <div className="mb-4">
        <h3 className="font-display text-lg font-semibold text-text-primary mb-2 group-hover:text-brand-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          {description}
        </p>
      </div>

      {/* Category and Tags */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-brand-primary bg-brand-primary/10 px-2 py-1 rounded-full">
            {category}
          </span>
        </div>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag, index) => (
              <span 
                key={index} 
                className="text-xs bg-text-muted/10 text-text-muted px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-brand-secondary rounded-xl hover:bg-interactive-hover transition-colors duration-200 font-medium group/copy"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            Copy Prompt
          </>
        )}
      </button>
    </div>
  );
}
