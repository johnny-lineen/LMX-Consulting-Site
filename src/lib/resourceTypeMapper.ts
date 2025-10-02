/**
 * Resource Type Mapping Utilities
 * Handles conversion between UI display labels and backend enum values
 */

// Mapping from enum values to display labels
export const RESOURCE_TYPE_LABELS = {
  'notion': 'Notion Template',
  'ebook': 'E-Book',
  'cheatsheet': 'Cheat Sheet',
  'video': 'Video',
  'scanned': 'Scanned Resource',
} as const;

// Mapping from display labels to enum values
export const RESOURCE_TYPE_VALUES = {
  'Notion Template': 'notion',
  'E-Book': 'ebook',
  'Cheat Sheet': 'cheatsheet',
  'Video': 'video',
  'Scanned Resource': 'scanned',
} as const;

// Valid enum values for backend
export const VALID_RESOURCE_TYPES = ['notion', 'ebook', 'cheatsheet', 'video', 'scanned'] as const;

// Valid display labels for UI
export const VALID_DISPLAY_LABELS = ['Notion Template', 'E-Book', 'Cheat Sheet', 'Video', 'Scanned Resource'] as const;

export type ResourceType = typeof VALID_RESOURCE_TYPES[number];
export type DisplayLabel = typeof VALID_DISPLAY_LABELS[number];

/**
 * Convert enum value to display label
 */
export function enumToLabel(enumValue: string): string {
  const normalizedValue = enumValue.toLowerCase().trim();
  return RESOURCE_TYPE_LABELS[normalizedValue as ResourceType] || enumValue;
}

/**
 * Convert display label to enum value
 */
export function labelToEnum(displayLabel: string): string {
  const normalizedLabel = displayLabel.trim();
  return RESOURCE_TYPE_VALUES[normalizedLabel as DisplayLabel] || displayLabel.toLowerCase();
}

/**
 * Normalize any type value to valid enum
 */
export function normalizeTypeValue(value: string): string {
  const trimmed = value.trim().toLowerCase();
  
  // Direct match
  if (VALID_RESOURCE_TYPES.includes(trimmed as ResourceType)) {
    return trimmed;
  }
  
  // Try to map from display label
  const enumValue = labelToEnum(value);
  if (VALID_RESOURCE_TYPES.includes(enumValue as ResourceType)) {
    return enumValue;
  }
  
  // Default fallback
  return 'ebook';
}

/**
 * Validate if a type value is valid
 */
export function isValidTypeValue(value: string): boolean {
  const normalized = normalizeTypeValue(value);
  return VALID_RESOURCE_TYPES.includes(normalized as ResourceType);
}

/**
 * Get clean error message for invalid type
 */
export function getTypeValidationError(): string {
  return 'Invalid resource type. Please select from Notion Template, Ebook, Cheat Sheet, or Video.';
}
