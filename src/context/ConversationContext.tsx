import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface IMessage {
  role: 'user' | 'assistant';
  message: string;
  timestamp: string;
}

export interface IConversation {
  conversationId: string;
  messageCount: number;
  lastMessage?: IMessage;
  createdAt: string;
  updatedAt: string;
}

export interface IUserInsights {
  _id: string;
  userId: string;
  advice: string[];
  bottlenecks: string[];
  context: string[];
  goals: string[];
  ideas: string[];
  questions: string[];
  strategies: string[];
  tags: string[];
  confidenceScore: number;
  sessionId?: string;
  createdAt: string;
  updatedAt: string;
}

interface ConversationContextType {
  currentConversationId: string | null;
  messages: IMessage[];
  conversations: IConversation[];
  userInsights: IUserInsights | null;
  conversationInsights: IUserInsights | null;
  loading: boolean;
  startConversation: () => Promise<string>;
  sendMessage: (message: string) => Promise<void>;
  loadConversation: (conversationId: string) => Promise<void>;
  loadConversations: () => Promise<void>;
  loadUserInsights: () => Promise<void>;
  loadConversationInsights: (conversationId: string) => Promise<void>;
  clearCurrentConversation: () => void;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export function ConversationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(() => {
    // Load from localStorage on initial render
    if (typeof window !== 'undefined') {
      return localStorage.getItem('currentConversationId');
    }
    return null;
  });
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [userInsights, setUserInsights] = useState<IUserInsights | null>(null);
  const [conversationInsights, setConversationInsights] = useState<IUserInsights | null>(null);
  const [loading, setLoading] = useState(false);

  const startConversation = async (): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    setLoading(true);
    try {
      const response = await fetch('/api/conversation/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start conversation');
      }

      const conversationId = data.conversationId;
      setCurrentConversationId(conversationId);
      
      // Persist to localStorage for page reload
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentConversationId', conversationId);
      }
      
      // Load the conversation to get the welcome message
      if (data.conversation?.messages) {
        setMessages(data.conversation.messages);
      } else {
        setMessages([]);
      }
      
      return conversationId;
    } finally {
      setLoading(false);
    }
  };


  const sendMessage = async (message: string): Promise<void> => {
    if (!user || !currentConversationId) {
      throw new Error('No active conversation');
    }

    // Optimistic UI: Add user message immediately
    const optimisticUserMessage: IMessage = {
      role: 'user',
      message: message.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, optimisticUserMessage]);
    setLoading(true);

    try {
      const response = await fetch(`/api/conversation/${currentConversationId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Remove optimistic message on error
        setMessages(prev => prev.filter(msg => msg !== optimisticUserMessage));
        throw new Error(data.error || 'Failed to send message');
      }

      // Replace optimistic message with server response and add assistant message
      setMessages(prev => {
        const withoutOptimistic = prev.filter(msg => msg !== optimisticUserMessage);
        return [
          ...withoutOptimistic,
          data.userMessage,
          data.assistantMessage
        ];
      });

      // Reload insights after new message (insights are processed async in background)
      // Wait a bit for the insight pipeline to process, then fetch once
      setTimeout(() => {
        loadUserInsights();
        if (currentConversationId) {
          loadConversationInsights(currentConversationId);
        }
      }, 3000); // Wait 3 seconds for insight processing to complete
    } catch (error) {
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg !== optimisticUserMessage));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadConversation = async (conversationId: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    setLoading(true);
    try {
      const response = await fetch(`/api/conversation/${conversationId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load conversation');
      }

      setCurrentConversationId(conversationId);
      
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentConversationId', conversationId);
      }
      
      setMessages(data.conversation.messages || []);
    } finally {
      setLoading(false);
    }
  };

  const loadConversations = async (): Promise<void> => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/conversation/user/${user.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load conversations');
      }

      setConversations(data.conversations || []);
    } finally {
      setLoading(false);
    }
  };

  const loadUserInsights = async (): Promise<void> => {
    if (!user) return;

    try {
      const response = await fetch(`/api/insights/user/${user.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load user insights');
      }

      setUserInsights(data.insights || null);
    } catch (error) {
      console.error('Error loading user insights:', error);
    }
  };

  const loadConversationInsights = async (conversationId: string): Promise<void> => {
    if (!user) return;

    try {
      const response = await fetch(`/api/insights/conversation/${conversationId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load conversation insights');
      }

      setConversationInsights(data.insights || null);
    } catch (error) {
      console.error('Error loading conversation insights:', error);
    }
  };


  const clearCurrentConversation = () => {
    setCurrentConversationId(null);
    setMessages([]);
    // Clear from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentConversationId');
    }
  };

  // Load conversations and insights when user changes
  useEffect(() => {
    if (user) {
      loadConversations();
      loadUserInsights();
    } else {
      setConversations([]);
      setUserInsights(null);
      clearCurrentConversation();
    }
  }, [user]);

  // Load conversation on page load if conversationId exists in localStorage
  useEffect(() => {
    if (currentConversationId && user && messages.length === 0) {
      // Load messages for the persisted conversation
      loadConversation(currentConversationId).catch(error => {
        console.error('Error loading persisted conversation:', error);
        // If load fails, clear and start fresh
        clearCurrentConversation();
      });
    }
  }, [currentConversationId, user]); // Run when user loads or conversationId changes

  // Load conversation insights when conversation changes
  useEffect(() => {
    if (currentConversationId && user) {
      loadConversationInsights(currentConversationId);
    } else {
      setConversationInsights(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentConversationId, user]);

  // Periodically refresh insights when there's an active conversation
  // Only poll if there are messages (conversation is active)
  useEffect(() => {
    if (!currentConversationId || !user || messages.length === 0) return;

    // Reduced frequency: Poll every 15 seconds instead of 3
    // This prevents request spam while still keeping insights updated
    const interval = setInterval(() => {
      loadUserInsights();
      if (currentConversationId) {
        loadConversationInsights(currentConversationId);
      }
    }, 15000); // Refresh every 15 seconds

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentConversationId, user, messages.length]); // Only re-create when these change

  const value = {
    currentConversationId,
    messages,
    conversations,
    userInsights,
    conversationInsights,
    loading,
    startConversation,
    sendMessage,
    loadConversation,
    loadConversations,
    loadUserInsights,
    loadConversationInsights,
    clearCurrentConversation,
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversation() {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error('useConversation must be used within a ConversationProvider');
  }
  return context;
}
