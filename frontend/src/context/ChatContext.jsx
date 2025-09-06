import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const addMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  const setMessagesData = (data) => {
    setMessages(data.messages || []);
    setHasMore(data.hasMore || false);
  };

  const clearMessages = () => {
    setMessages([]);
    setHasMore(false);
  };

  const value = {
    messages,
    currentTopic,
    topics,
    loading,
    hasMore,
    setMessages,
    setCurrentTopic,
    setTopics,
    setLoading,
    addMessage,
    setMessagesData,
    clearMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
