import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import CompactResourceCard from '@/components/CompactResourceCard';
import ResourceModal from '@/components/ResourceModal';
import EmailCaptureModal from '@/components/EmailCaptureModal';
import { FileText, Filter } from 'lucide-react';
import { PublicResource, RESOURCE_TYPE_LABELS, RESOURCE_BUTTON_TEXT } from '@/types/resource';

interface Resource extends PublicResource {
  mainFile?: string;
  images?: string[];
}

const RESOURCE_CATEGORIES = [
  'All Categories',
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

export default function ResourcesPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [allResources, setAllResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
    const [availableTypes, setAvailableTypes] = useState<string[]>([]);
    const [availableCategories, setAvailableCategories] = useState<string[]>([]);
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [pendingResourceAccess, setPendingResourceAccess] = useState<{resource: Resource; action: () => void} | null>(null);

    useEffect(() => {
        fetchAllResources();
    }, []);

    // Separate effect for filtering when filters change
    useEffect(() => {
        if (allResources.length > 0) {
            applyFilters();
        }
    }, [selectedType, selectedCategory, allResources]);

    const fetchAllResources = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/resources/list');
            
            if (response.ok) {
                const data = await response.json();
                setAllResources(data.resources);
                
                // Extract unique types and categories from all resources
                const types = Array.from(
                    new Set(data.resources.map((r: Resource) => r.type))
                ) as string[];
                setAvailableTypes(types);
                
                const categories = Array.from(
                    new Set(data.resources.map((r: Resource) => r.category))
                ) as string[];
                setAvailableCategories(categories);
            }
        } catch (error: unknown) {
            console.error('[ERROR]:', error instanceof Error ? error.message : String(error));
            if (error instanceof Error) console.error(error.stack);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...allResources];

        // Apply type filter
        if (selectedType !== 'all') {
            filtered = filtered.filter(resource => resource.type === selectedType);
        }

        // Apply category filter
        if (selectedCategory !== 'All Categories') {
            filtered = filtered.filter(resource => resource.category === selectedCategory);
        }

        setResources(filtered);
    };

    const handleResourceAccess = (resource: Resource) => {
        if (resource.gated) {
            // Show email capture modal for gated resources
            setPendingResourceAccess({
                resource,
                action: () => window.open(resource.fileUrl, '_blank')
            });
            setIsEmailModalOpen(true);
        } else {
            // Direct access for non-gated resources
            window.open(resource.fileUrl, '_blank');
        }
    };

    const handleEmailSuccess = (resourceUrl: string) => {
        // For logged-in users, we need to get the actual fileUrl from the pending resource
        const urlToOpen = resourceUrl === window.location.href && pendingResourceAccess 
            ? pendingResourceAccess.resource.fileUrl 
            : resourceUrl;
        window.open(urlToOpen, '_blank');
    };

    const handleDownload = (resourceId: string, title: string) => {
        // Find the resource to check if it's gated
        const resource = resources.find(r => r.id === resourceId);
        if (resource) {
            handleResourceAccess(resource);
        }
    };

    const handleOpenResource = (resource: Resource) => {
        setSelectedResource(resource);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedResource(null), 300); // Delay clearing to allow animation
    };

    return (
        <ProtectedRoute>
            <Layout
                title="AI for Microsoft 365 Resource Library"
                description="Ready-to-use templates, playbooks, and guides for integrating AI into Microsoft 365 workflows."
            >
                <section className="py-12 md:py-16">
                    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Header */}
                        <div className="mb-8">
                        <h1 className="font-display text-4xl font-bold text-text-primary">📚 Your AI for Microsoft 365 Resource Library</h1>
                        <p className="text-text-secondary mt-2 text-lg">
                            From ready-to-use Notion templates to step-by-step playbooks and eBooks, our library equips you with practical tools to integrate AI into your daily Microsoft 365 workflows. Stay ahead with curated content designed for consultants, teams, and professionals.
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="mb-8 space-y-6">
                        {/* Type Filter */}
                        {availableTypes.length > 1 && (
                            <div>
                                <h2 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                                    <Filter className="w-4 h-4" />
                                    Filter by Type
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setSelectedType('all')}
                                        className={`px-4 py-2 rounded-lg font-medium transition ${
                                            selectedType === 'all'
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                        }`}
                                    >
                                        All Types
                                    </button>
                                    {availableTypes.map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setSelectedType(type)}
                                            className={`px-4 py-2 rounded-lg font-medium transition ${
                                                selectedType === type
                                                    ? 'bg-blue-600 text-white shadow-md'
                                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                            }`}
                                        >
                                            {RESOURCE_TYPE_LABELS[type] || type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Category Filter */}
                        {availableCategories.length > 1 && (
                            <div>
                                <h2 className="text-sm font-semibold text-gray-600 mb-3">Filter by Category</h2>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setSelectedCategory('All Categories')}
                                        className={`px-4 py-2 rounded-lg font-medium transition ${
                                            selectedCategory === 'All Categories'
                                                ? 'bg-purple-600 text-white shadow-md'
                                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                        }`}
                                    >
                                        All Categories
                                    </button>
                                    {availableCategories.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategory(category)}
                                            className={`px-4 py-2 rounded-lg font-medium transition ${
                                                selectedCategory === category
                                                    ? 'bg-purple-600 text-white shadow-md'
                                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                            }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Resources Grid - Compact Cards with Modal */}
                    {loading ? (
                        <div className="text-center py-16">
                            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                            <p className="text-sm text-gray-500">Loading resources...</p>
                        </div>
                    ) : resources.length === 0 ? (
                        <div className="text-center py-16">
                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-1">
                                No resources available yet
                            </h3>
                            <p className="text-sm text-gray-500">
                                Check back soon for valuable resources!
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Compact Cards Grid */}
                            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                {resources.map((resource) => (
                                    <CompactResourceCard
                                        key={resource.id}
                                        id={resource.id}
                                        title={resource.title}
                                        coverImage={resource.coverImage}
                                        type={resource.type}
                                        gated={resource.gated}
                                        onOpen={() => handleOpenResource(resource)}
                                        onDownload={handleDownload}
                                    />
                                ))}
                            </div>

                            {/* Resource Details Modal */}
                            <ResourceModal
                                resource={selectedResource}
                                isOpen={isModalOpen}
                                onClose={handleCloseModal}
                                onDownload={handleDownload}
                            />
                        </>
                    )}

                    {/* Email Capture Modal */}
                    <EmailCaptureModal
                        isOpen={isEmailModalOpen}
                        onClose={() => {
                            setIsEmailModalOpen(false);
                            setPendingResourceAccess(null);
                        }}
                        onSuccess={handleEmailSuccess}
                        resourceTitle={pendingResourceAccess?.resource.title || ''}
                        resourceType={pendingResourceAccess?.resource.type || ''}
                        resourceId={pendingResourceAccess?.resource.id}
                    />
                    </div>
                </section>
            </Layout>
        </ProtectedRoute>
    );
}