# Clarity Consultation Bot Setup

## Overview
The Clarity Consultation Bot has been refactored with a ChatGPT-like interface featuring:

- **Welcome Message**: Displays when conversation starts
- **Suggested Prompts**: Clickable prompts that auto-send messages
- **GPT Integration**: Direct connection to OpenAI GPT-3.5-turbo
- **MongoDB Persistence**: Chat history is saved and restored
- **Loading Indicators**: Animated dots during response generation
- **Insights Placeholder**: Branded placeholder panel for future insights
- **Responsive Design**: Clean, modern UI with proper spacing

## Required Environment Variables

Create a `.env.local` file in the project root with:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/lmx-consulting

# OpenAI API Key (required for GPT integration)
OPENAI_API_KEY=your_openai_api_key_here

# JWT Secret (for authentication)
JWT_SECRET=your_jwt_secret_here
```

## Features Implemented

### ✅ Chatbox Enhancements
- Welcome message at the top of chat window
- Suggested prompts that auto-send when clicked
- ChatGPT-like layout (user messages on right, bot on left)
- Auto-scroll to bottom on new messages

### ✅ Insights Panel
- Placeholder panel with "coming soon" message
- Branded styling matching site design
- Rounded corners and soft shadows

### ✅ GPT Integration
- Direct connection to OpenAI GPT-3.5-turbo
- Conversation history context
- Fallback responses if GPT fails
- Professional business consultant persona

### ✅ Persistence
- MongoDB storage for conversation history
- Page refresh maintains chat history
- Automatic conversation loading

### ✅ UI/UX Improvements
- Loading animation (three dots)
- Clear conversation button
- Timestamps on messages
- Responsive grid layout
- Consistent branding

## Usage

1. Navigate to `/consultant` page
2. The bot will automatically start a new conversation
3. Click suggested prompts or type your own message
4. Chat history persists across page refreshes
5. Use "Clear Chat" to start fresh

## API Endpoints

- `POST /api/conversation/start` - Start new conversation
- `POST /api/conversation/[conversationId]/message` - Send message
- `GET /api/conversation/[conversationId]` - Load conversation
- `GET /api/conversation/user/[userId]` - List user conversations

## Technical Details

- **Frontend**: React with TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: MongoDB with Mongoose
- **AI**: OpenAI GPT-3.5-turbo
- **Authentication**: JWT-based
- **State Management**: React Context API
