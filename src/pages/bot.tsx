import React, { useState, useEffect, useRef } from 'react';
import { useConversation } from '@/context/ConversationContext';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Send, Sparkles } from 'lucide-react';

/**
 * Professional Consultation Bot Interface
 * - Light, clean theme with consulting brand colors
 * - Modern chat interface with global site styling
 * - Responsive design with mobile support
 * - Insights sidebar (desktop only)
 */
export default function BotPage() {
  const { user } = useAuth();
  const {
    currentConversationId,
    messages,
    loading,
    startConversation,
    sendMessage,
    clearCurrentConversation,
    userInsights,
  } = useConversation();

  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);


  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Start conversation on component mount (only once)
  useEffect(() => {
    if (!currentConversationId && user) {
      startConversation().catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // Only run when user is available, not on every conversationId change

  // Focus input after sending
  useEffect(() => {
    if (!isGenerating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isGenerating]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || loading || isGenerating) return;

    const messageText = inputValue.trim();
    setInputValue('');
    setIsGenerating(true);

    try {
      await sendMessage(messageText);
    } catch (error: unknown) {
      console.error('[ERROR]:', error instanceof Error ? error.message : String(error));
      if (error instanceof Error) console.error(error.stack);
      setInputValue(messageText);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearConversation = async () => {
    // Clear current state immediately
    clearCurrentConversation();
    // Start a fresh conversation
    await startConversation().catch(console.error);
  };

  // Loading dots animation
  const LoadingDots = () => (
    <div className="flex space-x-1.5 py-2">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-white">
        {/* Global Navbar */}
        <Navbar />

        {/* Main Content Area - Solid Background */}
        <div className="flex-1 flex overflow-hidden bg-gray-50">
          <div className="flex-1 flex gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Centered Chat Container */}
            <div className="flex-1 max-w-3xl mx-auto flex flex-col">
              {/* Chat Frame - Minimal Design */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 flex flex-col h-[calc(100vh-10rem)] overflow-hidden relative">
                {/* New Chat Button - Top Right Corner */}
                <button
                  onClick={handleClearConversation}
                  className="absolute top-4 right-4 z-10 px-3 py-1.5 text-xs text-muted hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                >
                  New Chat
                </button>

                {/* Messages Container - Smooth Scrolling */}
                <div className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth">
                  <div className="space-y-5 pt-8">
                    {messages.length === 0 ? (
                      // Minimal Empty State
                      <div className="flex items-center justify-center min-h-full text-gray-400">
                        <p className="text-sm">Start a conversation...</p>
                      </div>
                    ) : (
                      // Messages List
                      <>
                        {messages.map((message, index) => (
                          <div
                            key={`${message.role}-${message.timestamp}-${index}`}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`flex items-start space-x-2.5 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                              {/* Avatar */}
                              <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center shadow-sm ${
                                message.role === 'user'
                                  ? 'bg-gradient-to-br from-primary to-secondary'
                                  : 'bg-gray-50 border border-gray-200'
                              }`}>
                                {message.role === 'user' ? (
                                  <span className="text-xs font-semibold text-white">
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                  </span>
                                ) : (
                                  <Sparkles className="w-4 h-4 text-primary" />
                                )}
                              </div>

                              {/* Message Content */}
                              <div className={`flex-1 px-4 py-2.5 rounded-xl ${
                                message.role === 'user'
                                  ? 'bg-gradient-to-br from-primary to-secondary text-white shadow-sm'
                                  : 'bg-gray-50 text-foreground'
                              }`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>
                                <p className={`text-xs mt-1.5 ${message.role === 'user' ? 'text-white/60' : 'text-muted'}`}>
                                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Loading Indicator */}
                        {isGenerating && (
                          <div className="flex justify-start">
                            <div className="flex items-start space-x-2.5">
                              <div className="flex-shrink-0 w-8 h-8 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center shadow-sm">
                                <Sparkles className="w-4 h-4 text-primary" />
                              </div>
                              <div className="bg-gray-50 px-4 py-2.5 rounded-xl">
                                <LoadingDots />
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Input Bar - Fixed at bottom */}
                <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 bg-white">
                  <div className="flex items-center space-x-3 bg-gray-50 border-2 border-gray-200 rounded-xl p-3 focus-within:border-primary transition-colors">
                    {/* Text Input */}
                    <textarea
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Ask me anything about your business..."
                      disabled={loading || isGenerating}
                      rows={1}
                      className="flex-1 bg-transparent text-foreground placeholder-muted resize-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed py-2 text-sm max-h-24"
                      style={{ minHeight: '24px' }}
                    />

                    {/* Send Button */}
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || loading || isGenerating}
                      className="flex-shrink-0 p-2.5 bg-gradient-to-br from-primary to-secondary text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                      title="Send message"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Insights Sidebar - Desktop Only */}
            <div className="hidden lg:flex lg:w-80 flex-col">
              {/* Insights Frame */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 h-[calc(100vh-10rem)] flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-sm text-muted font-medium">Insights coming soon…</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Footer */}
        <Footer />
      </div>
    </ProtectedRoute>
  );
}