import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import CompactResourceCard from '@/components/CompactResourceCard';
import ResourceModal from '@/components/ResourceModal';
import { FileText } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  slug: string;
  mainFile?: string;
  coverImage: string; // Always present (actual or placeholder)
  images?: string[]; // Additional product/preview images
  tags: string[];
  createdAt: string;
}

const RESOURCE_TYPE_LABELS: Record<string, string> = {
  'ebook': 'E-Book',
  'checklist': 'Checklist',
  'guide': 'Guide',
  'notion-template': 'Notion Template',
  'toolkit': 'Toolkit',
  'other': 'Other',
};

export default function ResourcesPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState<string>('all');
    const [availableTypes, setAvailableTypes] = useState<string[]>([]);
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchResources();
    }, [selectedType]);

    const fetchResources = async () => {
        try {
            const url = selectedType === 'all' 
                ? '/api/resources/list' 
                : `/api/resources/list?type=${selectedType}`;
            
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setResources(data.resources);
                
                // Extract unique types
                const types = Array.from(
                    new Set(data.resources.map((r: Resource) => r.type))
                ) as string[];
                setAvailableTypes(types);
            }
        } catch (error) {
            console.error('Error fetching resources:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (resourceId: string, title: string) => {
        window.location.href = `/api/resources/download/${resourceId}`;
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
                title="Resources"
                description="Premium toolkits and templates for your success."
            >
                <section className="container-px max-w-7xl mx-auto py-12 md:py-16">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold">Resource Library</h1>
                        <p className="text-muted mt-2 text-lg">
                            Download valuable resources to boost your productivity and leverage AI effectively.
                        </p>
                    </div>

                    {/* Type Filter */}
                    {availableTypes.length > 1 && (
                        <div className="mb-8">
                            <h2 className="text-sm font-semibold text-gray-600 mb-3">Filter by Type</h2>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedType('all')}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${
                                        selectedType === 'all'
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                    }`}
                                >
                                    All Resources
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
                </section>
            </Layout>
        </ProtectedRoute>
    );
}