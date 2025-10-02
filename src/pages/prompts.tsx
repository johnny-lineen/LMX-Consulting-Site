import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import PromptCard from '@/components/PromptCard';
import PromptFilter from '@/components/PromptFilter';
import CTAButton from '@/components/CTAButton';

/**
 * Prompts Page - Prompt Library
 * 
 * Design Decision: Matches homepage layout and styling with hero section,
 * search/filter functionality, and responsive grid of prompt cards.
 * Uses the same brand colors, typography, and spacing as the rest of the site.
 */

interface Prompt {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  prompt: string;
  createdAt: string;
  updatedAt: string;
}

interface PromptsPageProps {
  initialPrompts: Prompt[];
}

export default function PromptsPage({ initialPrompts }: PromptsPageProps) {
  const [prompts, setPrompts] = useState<Prompt[]>(initialPrompts);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Get unique categories from prompts
  const categories = Array.from(new Set(prompts.map(p => p.category))).sort();

  // Filter prompts based on search and category
  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = !searchQuery || 
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || prompt.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        setLoading(true);
        fetchPrompts(searchQuery, selectedCategory === 'all' ? undefined : selectedCategory)
          .then(fetchedPrompts => {
            setPrompts(fetchedPrompts);
            setLoading(false);
          })
          .catch(error => {
            console.error('Search failed:', error);
            setLoading(false);
          });
      } else {
        setPrompts(initialPrompts);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory, initialPrompts]);

  const fetchPrompts = async (search?: string, category?: string): Promise<Prompt[]> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    
    const response = await fetch(`/api/prompts/list?${params}`);
    const data = await response.json();
    
    if (response.ok) {
      return data.prompts;
    } else {
      throw new Error(data.error || 'Failed to fetch prompts');
    }
  };

  const handleCopy = () => {
    setCopyFeedback('Prompt copied to clipboard!');
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  return (
    <Layout
      title="Prompt Library"
      description="Explore optimized prompts for productivity, Microsoft 365, and beyond. Tested in real consultations and interviews."
    >
      {/* Hero Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Prompt Library
          </h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed mb-8">
            Explore optimized prompts for productivity, Microsoft 365, and beyond. 
            Tested in real consultations and interviews.
          </p>
          
          {/* Success Feedback */}
          {copyFeedback && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-status-success text-brand-secondary rounded-lg mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {copyFeedback}
            </div>
          )}
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-bg-secondary">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <PromptFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categories}
            totalCount={initialPrompts.length}
            filteredCount={filteredPrompts.length}
          />
        </div>
      </section>

      {/* Prompts Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-text-secondary">Searching prompts...</p>
            </div>
          ) : filteredPrompts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-text-muted/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
                No prompts found
              </h3>
              <p className="text-text-secondary mb-6">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Check back soon for new prompts!'
                }
              </p>
              {(searchQuery || selectedCategory !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="px-6 py-3 bg-brand-primary text-brand-secondary rounded-xl hover:bg-interactive-hover transition-colors duration-200 font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredPrompts.map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    id={prompt.id}
                    title={prompt.title}
                    description={prompt.description}
                    category={prompt.category}
                    tags={prompt.tags}
                    prompt={prompt.prompt}
                    onCopy={handleCopy}
                  />
                ))}
              </div>

              {/* Load More Button (if needed for future pagination) */}
              {filteredPrompts.length >= 12 && (
                <div className="text-center mt-12">
                  <button
                    onClick={() => {
                      // Future: implement load more functionality
                      console.log('Load more prompts');
                    }}
                    className="px-8 py-3 border-2 border-brand-primary text-brand-primary rounded-xl hover:bg-brand-primary hover:text-brand-secondary transition-colors duration-200 font-medium"
                  >
                    Load More Prompts
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-bg-secondary">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-text-primary mb-4">
            Need More Resources?
          </h2>
          <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
            Explore our complete resource library with templates, playbooks, and guides 
            for AI-powered productivity.
          </p>
          <div className="flex justify-center gap-4">
            <CTAButton href="/resources">Explore Resources</CTAButton>
            <CTAButton href="/community" variant="secondary">
              Join Community
            </CTAButton>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<PromptsPageProps> = async () => {
  try {
    // Import required modules for server-side data fetching
    const { connectDB } = await import('@/lib/mongodb');
    const { Prompt } = await import('@/models/Prompt');
    
    await connectDB();
    
    // Fetch prompts directly from database
    const prompts = await Prompt.find({})
      .sort({ createdAt: -1 })
      .lean();
    
    return {
      props: {
        initialPrompts: prompts.map(prompt => ({
          id: prompt._id.toString(),
          title: prompt.title,
          description: prompt.description,
          category: prompt.category,
          tags: prompt.tags,
          prompt: prompt.prompt,
          createdAt: prompt.createdAt.toISOString(),
          updatedAt: prompt.updatedAt.toISOString(),
        }))
      }
    };
  } catch (error) {
    console.error('Error fetching prompts:', error);
    
    return {
      props: {
        initialPrompts: []
      }
    };
  }
};
