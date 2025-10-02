import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Prompt } from '../src/models/Prompt';

// Load environment variables from .env.local or .env
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

/**
 * Seed Script for Prompt Collection
 * 
 * This script populates the Prompt collection with 15 test prompts
 * across 4 categories: Microsoft 365, Productivity, Notion, and AI Agents.
 * 
 * Usage: npx ts-node scripts/seedPrompts.ts
 * 
 * Design Decision: Uses existing Prompt model and MongoDB connection
 * to ensure consistency with the main application.
 */

// Sample prompts data organized by category
const SAMPLE_PROMPTS = [
  // Microsoft 365 Category (4 prompts)
  {
    title: "Excel Formula Expert",
    description: "Generate complex Excel formulas for data analysis and automation tasks.",
    category: "Microsoft 365",
    tags: ["excel", "formulas", "data analysis", "automation"],
    prompt: "You are an Excel formula expert. Help me create a formula that [DESCRIBE YOUR TASK]. Consider best practices for performance and readability. Provide the formula, explain how it works, and suggest any alternative approaches."
  },
  {
    title: "Outlook Email Assistant",
    description: "Craft professional emails with proper tone and structure for business communication.",
    category: "Microsoft 365",
    tags: ["outlook", "email", "communication", "professional"],
    prompt: "You are a professional email writing assistant. Help me compose an email that is [TONE: formal/casual/urgent]. The email should be about [TOPIC] and needs to [SPECIFIC PURPOSE]. Include proper greeting, clear body, and professional closing."
  },
  {
    title: "Teams Meeting Scheduler",
    description: "Optimize Teams meeting scheduling and agenda creation for better productivity.",
    category: "Microsoft 365",
    tags: ["teams", "meetings", "scheduling", "agenda"],
    prompt: "You are a meeting efficiency expert. Help me schedule a Teams meeting for [PURPOSE] with [NUMBER] participants. Create an agenda, suggest optimal timing, and provide best practices for the meeting. Include preparation steps for attendees."
  },
  {
    title: "Word Document Formatter",
    description: "Format Word documents with professional styling, headers, and consistent formatting.",
    category: "Microsoft 365",
    tags: ["word", "formatting", "document", "professional"],
    prompt: "You are a Word document formatting expert. Help me format a [DOCUMENT TYPE: report/letter/proposal/etc.] with professional styling. Include guidance on headers, fonts, spacing, page layout, and accessibility best practices."
  },

  // Productivity Category (4 prompts)
  {
    title: "Content Summarizer",
    description: "Create concise, accurate summaries of long documents, articles, or meeting notes.",
    category: "Productivity",
    tags: ["summarization", "content", "notes", "efficiency"],
    prompt: "You are a content summarization expert. Please summarize the following content in [LENGTH: brief/detailed] format. Focus on key points, main arguments, and actionable insights. Maintain accuracy while improving readability."
  },
  {
    title: "Time Management Planner",
    description: "Create effective daily, weekly, and monthly schedules with priority-based task management.",
    category: "Productivity",
    tags: ["time management", "planning", "scheduling", "priorities"],
    prompt: "You are a productivity and time management expert. Help me create a [TIMEFRAME: daily/weekly/monthly] schedule that maximizes productivity. Consider my goals: [LIST YOUR GOALS], available time: [HOURS], and priorities: [TOP 3 PRIORITIES]. Include buffer time and breaks."
  },
  {
    title: "Writing Assistant",
    description: "Improve writing quality, grammar, and style for various document types and audiences.",
    category: "Productivity",
    tags: ["writing", "grammar", "style", "editing"],
    prompt: "You are a professional writing assistant. Help me improve this text for [AUDIENCE: colleagues/clients/students/etc.] and [PURPOSE: inform/persuade/instruct/etc.]. Focus on clarity, conciseness, and appropriate tone. Provide specific suggestions for improvement."
  },
  {
    title: "Task Breakdown Expert",
    description: "Break down complex projects into manageable, actionable tasks with clear dependencies.",
    category: "Productivity",
    tags: ["project management", "tasks", "planning", "organization"],
    prompt: "You are a project management expert. Help me break down this project: [PROJECT DESCRIPTION] into manageable tasks. Include task dependencies, estimated time, required resources, and success criteria for each task."
  },

  // Notion Category (3 prompts)
  {
    title: "Notion Content Organizer",
    description: "Structure and organize content in Notion with databases, templates, and workflows.",
    category: "Notion",
    tags: ["notion", "organization", "databases", "templates"],
    prompt: "You are a Notion workspace expert. Help me organize [CONTENT TYPE: notes/projects/contacts/etc.] in Notion. Design a database structure, suggest properties, create templates, and recommend workflows for efficient content management."
  },
  {
    title: "Notion Dashboard Builder",
    description: "Create comprehensive Notion dashboards with widgets, metrics, and quick access links.",
    category: "Notion",
    tags: ["notion", "dashboard", "metrics", "widgets"],
    prompt: "You are a Notion dashboard specialist. Help me create a dashboard for [PURPOSE: personal/project/team management]. Include relevant widgets, key metrics, quick access links, and ensure the layout is clean and functional."
  },
  {
    title: "Notion Template Creator",
    description: "Design reusable Notion templates for common workflows and document types.",
    category: "Notion",
    tags: ["notion", "templates", "workflows", "automation"],
    prompt: "You are a Notion template designer. Create a template for [TEMPLATE TYPE: meeting notes/project tracker/content calendar/etc.]. Include all necessary sections, properties, and automation rules. Ensure it's reusable and adaptable."
  },

  // AI Agents Category (4 prompts)
  {
    title: "Task Management Agent",
    description: "AI agent for managing tasks, deadlines, and project workflows with intelligent prioritization.",
    category: "Agents",
    tags: ["ai agent", "task management", "automation", "priorities"],
    prompt: "You are an AI task management agent. Help me manage my tasks by analyzing [CURRENT TASKS], deadlines, and priorities. Suggest task sequencing, identify bottlenecks, recommend delegation opportunities, and create an optimized action plan."
  },
  {
    title: "Meeting Assistant Agent",
    description: "AI agent for meeting preparation, note-taking, and follow-up action item tracking.",
    category: "Agents",
    tags: ["ai agent", "meetings", "notes", "follow-up"],
    prompt: "You are an AI meeting assistant. Help me prepare for a meeting about [TOPIC] with [ATTENDEES]. Create an agenda, prepare talking points, suggest questions to ask, and set up a system for tracking action items and follow-ups."
  },
  {
    title: "Content Creation Agent",
    description: "AI agent for generating, editing, and optimizing content across multiple formats and platforms.",
    category: "Agents",
    tags: ["ai agent", "content creation", "writing", "optimization"],
    prompt: "You are an AI content creation agent. Help me create [CONTENT TYPE: blog post/social media/email/etc.] about [TOPIC] for [AUDIENCE]. Include research suggestions, content structure, key messages, and optimization recommendations for engagement."
  },
  {
    title: "Research Assistant Agent",
    description: "AI agent for conducting research, analyzing data, and synthesizing findings into actionable insights.",
    category: "Agents",
    tags: ["ai agent", "research", "analysis", "insights"],
    prompt: "You are an AI research assistant. Help me research [TOPIC] with a focus on [SPECIFIC ASPECT]. Provide research methodology, key sources to explore, analysis framework, and synthesize findings into actionable insights and recommendations."
  }
];

/**
 * Main seeding function
 * Connects to MongoDB, clears existing prompts, and inserts sample data
 */
async function seedPrompts() {
  try {
    console.log('🌱 Starting prompt seeding process...');
    
    // Connect to MongoDB using environment variable
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI environment variable is not set');
      console.log('💡 Please ensure you have a .env.local file with your MongoDB connection string');
      console.log('💡 Example: MONGODB_URI=mongodb://localhost:27017/your-database-name');
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB successfully');
    
    // Clear existing prompts
    console.log('🗑️  Clearing existing prompts...');
    const deleteResult = await Prompt.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} existing prompts`);
    
    // Insert new prompts
    console.log('📝 Inserting new prompts...');
    const insertResult = await Prompt.insertMany(SAMPLE_PROMPTS);
    console.log(`✅ Successfully inserted ${insertResult.length} prompts`);
    
    // Log summary by category
    const categorySummary = SAMPLE_PROMPTS.reduce((acc, prompt) => {
      acc[prompt.category] = (acc[prompt.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('\n📊 Prompt Summary by Category:');
    Object.entries(categorySummary).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} prompts`);
    });
    
    console.log('\n🎉 Prompt seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during prompt seeding:', error);
    throw error;
  } finally {
    // Close MongoDB connection
    console.log('🔌 Closing MongoDB connection...');
    await mongoose.connection.close();
    console.log('✅ Connection closed');
    
    // Exit process
    process.exit(0);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled promise rejection:', error);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
  process.exit(1);
});

// Run the seeding function
if (require.main === module) {
  seedPrompts().catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
}

export default seedPrompts;
