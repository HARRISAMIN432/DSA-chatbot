import { useState, useEffect, useRef } from "react";
import { useChat } from "../context/ChatContext.jsx";
import { chatService } from "../services/chatService.js";
import MessageBubble from "../components/MessageBubble.jsx";
import MessageInput from "../components/MessageInput.jsx";

const Chat = () => {
  const {
    messages,
    currentTopic,
    loading,
    setLoading,
    addMessage,
    setMessagesData,
    setTopics,
  } = useChat();

  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadMessages();
  }, [currentTopic]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = async () => {
    if (currentTopic) {
      setLoading(true);
      try {
        const response = await chatService.getMessages(currentTopic);
        setMessagesData(response);
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSendMessage = async (message) => {
    setSending(true);

    const userMessage = {
      message,
      role: "user",
      createdAt: new Date().toISOString(),
    };
    addMessage(userMessage);

    try {
      const response = await chatService.sendMessage(message, currentTopic);

      const aiMessage = {
        message: response.response,
        role: "ai",
        createdAt: new Date().toISOString(),
      };
      addMessage(aiMessage);

      const topicsResponse = await chatService.getTopics();
      setTopics(topicsResponse.topics || []);
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage = {
        message: "Sorry, I encountered an error. Please try again.",
        role: "ai",
        createdAt: new Date().toISOString(),
      };
      addMessage(errorMessage);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Chat Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <h2 className="text-lg font-semibold text-white">
          {currentTopic || "New Chat"}
        </h2>
        <p className="text-sm text-gray-400">
          Ask me anything about Data Structures & Algorithms
        </p>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {loading && messages.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-400 h-64 flex flex-col items-center justify-center">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">
                Ready to learn DSA?
              </h3>
              <p>
                Ask me about arrays, linked lists, trees, graphs, algorithms,
                and more!
              </p>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => (
                <MessageBubble
                  key={index}
                  message={msg.message}
                  role={msg.role}
                />
              ))}
              {sending && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-700 px-4 py-3 rounded-2xl shadow-lg">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <MessageInput onSend={handleSendMessage} disabled={sending} />
    </div>
  );
};

export default Chat;
