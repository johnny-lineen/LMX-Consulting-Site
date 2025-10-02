import { Search } from 'lucide-react';

/**
 * PromptFilter Component - Search and category filtering for prompts
 * 
 * Design Decision: Consistent with existing admin panel styling and
 * homepage design patterns. Includes search input and category tabs
 * for easy filtering and discovery.
 */
interface PromptFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  totalCount: number;
  filteredCount: number;
}

export default function PromptFilter({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  totalCount,
  filteredCount
}: PromptFilterProps) {
  return (
    <div className="mb-8">
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
        <input
          type="text"
          placeholder="Search prompts by title, description, or content..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-border-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary bg-bg-primary text-text-primary placeholder-text-muted"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => onCategoryChange('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            selectedCategory === 'all'
              ? 'bg-brand-primary text-brand-secondary shadow-glow-sm'
              : 'bg-bg-secondary text-text-secondary hover:text-brand-primary hover:bg-bg-tertiary'
          }`}
        >
          All Prompts ({totalCount})
        </button>
        
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              selectedCategory === category
                ? 'bg-brand-primary text-brand-secondary shadow-glow-sm'
                : 'bg-bg-secondary text-text-secondary hover:text-brand-primary hover:bg-bg-tertiary'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Results Summary */}
      <div className="text-sm text-text-secondary">
        {filteredCount !== totalCount ? (
          <>
            Showing {filteredCount} of {totalCount} prompts
            {searchQuery && (
              <span className="text-brand-primary ml-2">
                (filtered by "{searchQuery}")
              </span>
            )}
          </>
        ) : (
          `Showing all ${totalCount} prompts`
        )}
      </div>
    </div>
  );
}
