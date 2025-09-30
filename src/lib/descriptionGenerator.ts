/**
 * Generate meaningful descriptions from resource titles
 */

interface DescriptionTemplate {
  pattern: RegExp;
  generate: (keywords: string[]) => string;
}

const templates: DescriptionTemplate[] = [
  {
    pattern: /retention|churn|customer/i,
    generate: (keywords) => 
      `Learn proven strategies for ${keywords.join(', ')} with this comprehensive resource. Designed to help businesses reduce churn and increase customer lifetime value.`
  },
  {
    pattern: /guide|roadmap|plan/i,
    generate: (keywords) => 
      `A complete step-by-step guide covering ${keywords.join(', ')}. Follow this roadmap to achieve measurable results and improve your processes.`
  },
  {
    pattern: /checklist|tasks|workflow/i,
    generate: (keywords) => 
      `Streamline your workflow with this actionable checklist. Covering ${keywords.join(', ')}, this resource helps you stay organized and productive.`
  },
  {
    pattern: /template|toolkit/i,
    generate: (keywords) => 
      `Ready-to-use templates and tools for ${keywords.join(', ')}. Save time and implement best practices with these customizable resources.`
  },
  {
    pattern: /ai|automation|copilot/i,
    generate: (keywords) => 
      `Leverage AI and automation for ${keywords.join(', ')}. This resource provides practical strategies to save time and boost productivity.`
  },
  {
    pattern: /tiktok|social|content/i,
    generate: (keywords) => 
      `Master ${keywords.join(', ')} with proven strategies and templates. Create engaging content that drives results and builds your audience.`
  },
];

/**
 * Extract meaningful keywords from title
 */
export function extractKeywords(title: string): string[] {
  const commonWords = [
    'the', 'a', 'an', 'and', 'or', 'but', 'for', 'to', 'of', 'in', 'on', 'at',
    'with', 'this', 'that', 'your', 'how', 'from', 'into', 'guide', 'ebook',
    'checklist', 'template', 'toolkit', 'day', 'step'
  ];
  
  return title
    .toLowerCase()
    .split(/[\s-_]+/)
    .filter(word => word.length > 3)
    .filter(word => !commonWords.includes(word))
    .filter(word => !word.match(/^\d+$/))
    .slice(0, 4); // Max 4 keywords
}

/**
 * Generate a meaningful description from resource title
 */
export function generateDescription(title: string, type?: string): string {
  const keywords = extractKeywords(title);
  
  if (keywords.length === 0) {
    return `A valuable resource designed to help you achieve better results. This ${type || 'resource'} provides actionable insights and practical strategies.`;
  }
  
  // Find matching template
  for (const template of templates) {
    if (template.pattern.test(title)) {
      return template.generate(keywords);
    }
  }
  
  // Default template
  const keywordPhrase = keywords.length > 0 ? keywords.join(', ') : 'key topics';
  return `Discover actionable strategies for ${keywordPhrase}. This comprehensive resource provides practical insights and proven methods to help you achieve measurable results.`;
}

/**
 * Generate target audience from type and keywords
 */
export function generateTargetAudience(type: string, keywords: string[]): string {
  const typeAudience: Record<string, string> = {
    'ebook': 'professionals and business owners',
    'guide': 'teams and individuals',
    'checklist': 'busy professionals',
    'notion-template': 'productivity enthusiasts',
    'toolkit': 'businesses and consultants',
  };
  
  return typeAudience[type] || 'users';
}

/**
 * Generate outcome from keywords
 */
export function generateOutcome(keywords: string[]): string {
  if (keywords.some(k => k.includes('retention') || k.includes('churn'))) {
    return 'customer retention and reduce churn';
  }
  if (keywords.some(k => k.includes('content') || k.includes('social'))) {
    return 'content creation and audience growth';
  }
  if (keywords.some(k => k.includes('productivity') || k.includes('automation'))) {
    return 'productivity and save time';
  }
  
  return 'performance and achieve goals';
}
