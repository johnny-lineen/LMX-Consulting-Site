/**
 * Reusable insight type definitions
 */

export type InsightType = 'goal' | 'preference' | 'constraint' | 'context';

export interface Insight {
  type: InsightType;
  content: string;
  sourceMessage: string;
  createdAt: Date;
}

export interface UserInsight {
  type: InsightType;
  content: string;
  sourceConversationId: string;
  createdAt: Date;
  priority?: number;
  tags?: string[];
  confidenceScore?: number;
}
