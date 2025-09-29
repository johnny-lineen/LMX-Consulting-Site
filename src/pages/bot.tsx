import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Insights {
  goals: string[];
  questions: string[];
  ideas: string[];
  advice: string[];
  tags: string[];
  recentMessages: Message[];
}

/**
 * Chat + Insights Bot page
 * - Left side: Chat window with conversation
 * - Right side: User insights panel with categories
 * - Mock data for now, ready for backend integration
 */
export default function BotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [userFirstName] = useState('John'); // Mock user name
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{ title: string; items: string[] } | null>(null);

  // Mock insights data
  const mockInsights: Insights = {
    goals: ["automate tasks", "analyze data", "improve customer service"],
    questions: ["lack of clarity on objectives", "existing technology limitations"],
    ideas: ["define objectives", "assess current state", "research AI solutions"],
    advice: ["start with a small-scale pilot project", "track performance metrics"],
    tags: ["ai", "business integration", "automation", "customer experience"],
    recentMessages: []
  };

  // Backend hook placeholders
  const sendMessage = async (userId: string, content: string) => {
    // TODO: POST /api/conversation/message
    console.log('Sending message:', { userId, content });
    return { success: true };
  };

  const fetchConversation = async (userId: string) => {
    // TODO: GET /api/conversation/:userId
    console.log('Fetching conversation for:', userId);
    return { messages: [] };
  };

  const fetchInsights = async (userId: string) => {
    // TODO: GET /api/insights/:userId
    console.log('Fetching insights for:', userId);
    return mockInsights;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // Call backend hook
    await sendMessage('user123', inputValue);
  };

  const handleClearConversation = () => {
    setMessages([]);
    console.log('Clearing conversation');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const Chip: React.FC<{ text: string; color: string; onClick?: () => void }> = ({ text, color, onClick }) => (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors duration-200 ${color} ${
        onClick ? 'hover:opacity-80' : ''
      }`}
      onClick={onClick}
    >
      {text}
    </span>
  );

  const handleSeeMore = (title: string, items: string[]) => {
    setModalData({ title, items });
    setModalOpen(true);
  };

  const InsightCategory: React.FC<{
    title: string;
    items: string[];
    color: string;
    maxVisible?: number;
  }> = ({ title, items, color, maxVisible = 3 }) => {
    const visibleItems = items.slice(0, maxVisible);
    const remainingCount = items.length - maxVisible;

    return (
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>
        <div className="flex flex-wrap gap-2">
          {visibleItems.map((item, index) => (
            <Chip key={index} text={item} color={color} />
          ))}
          {remainingCount > 0 && (
            <button
              onClick={() => handleSeeMore(title, items)}
              className="text-xs text-primary hover:text-primary/80 self-center underline cursor-pointer"
            >
              See More ({remainingCount} more)
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <ProtectedRoute>
      <Layout title="Clarity Consultation Bot" description="AI-powered consultation with live insights.">
        <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
            
            {/* Left Side - Chat Window (2/3 width) */}
            <div className="lg:col-span-2 bg-background rounded-lg shadow-lg flex flex-col border border-gray-200">
              {/* Chat Header */}
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-foreground">Clarity Consultation</h2>
                <button
                  onClick={handleClearConversation}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                >
                  Clear Conversation
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <p className="text-lg font-medium">No conversation yet</p>
                      <p className="text-sm">Start by asking a question below</p>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-foreground'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - User Insights Panel (1/3 width) */}
            <div className="bg-background rounded-lg shadow-lg p-6 overflow-y-auto border border-gray-200">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                {userFirstName} Insights
              </h2>

              {/* Goals */}
              <InsightCategory
                title="Goals"
                items={mockInsights.goals}
                color="bg-blue-100 text-blue-800 hover:bg-blue-200"
              />

              {/* Questions to Answer */}
              <InsightCategory
                title="Questions to Answer"
                items={mockInsights.questions}
                color="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
              />

              {/* Potential Ideas */}
              <InsightCategory
                title="Potential Ideas"
                items={mockInsights.ideas}
                color="bg-green-100 text-green-800 hover:bg-green-200"
              />

              {/* Advice */}
              <InsightCategory
                title="Advice"
                items={mockInsights.advice}
                color="bg-purple-100 text-purple-800 hover:bg-purple-200"
              />

              {/* Tags */}
              <InsightCategory
                title="Tags"
                items={mockInsights.tags}
                color="bg-gray-100 text-gray-800 hover:bg-gray-200"
              />

              {/* Recent Messages */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground mb-3">Recent Messages</h3>
                <div className="text-sm text-muted">
                  {messages.length === 0 ? (
                    <p>No conversation yet</p>
                  ) : (
                    <div className="space-y-2">
                      {messages.slice(-3).map((message) => (
                        <div key={message.id} className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-muted mb-1">
                            {message.role === 'user' ? 'You' : 'Assistant'} • {message.timestamp.toLocaleTimeString()}
                          </p>
                          <p className="text-sm text-foreground truncate">{message.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for "See More" */}
      {modalOpen && modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-foreground">{modalData.title}</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-64">
              <div className="flex flex-wrap gap-2">
                {modalData.items.map((item, index) => (
                  <Chip key={index} text={item} color="bg-gray-100 text-gray-800" />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      </Layout>
    </ProtectedRoute>
  );
}
