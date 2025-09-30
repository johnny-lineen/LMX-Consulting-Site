# Consulting Chatbot System

## 🎯 **Complete Implementation**

A full conversation system with persistence and insights extraction.

## 🏗️ **Database Models**

### **Conversation**
- Stores user messages and assistant responses
- Unique conversationId per conversation
- Linked to userId

### **ConversationInsights** 
- Stores insights extracted from each conversation
- Categorized by type: goal, preference, constraint, context
- Links to source messages

### **UserInsights**
- Aggregates all insights for a user
- Deduplicates similar insights
- One document per user

## 🔄 **API Endpoints**

- `POST /api/conversation/start` - Start new conversation
- `POST /api/chat` - Send message and get response
- `GET /api/conversation/user/[userId]` - Get user conversations
- `GET /api/insights/user/[userId]` - Get user insights

## 🧠 **Insights Pipeline**

1. Extract insights from each message
2. Categorize by type (goal, preference, constraint, context)
3. Save to conversation insights
4. Merge into user insights with deduplication

## 🎨 **Frontend Features**

- Real-time chat interface
- Live insights panel
- Conversation persistence
- Protected routes

## ✅ **Status: COMPLETE**

All requirements implemented and ready for use!