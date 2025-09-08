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
    setCurrentTopic,
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
      if (!currentTopic && response.topic) {
        setCurrentTopic(response.topic);
      }
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
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.02)_50%,transparent_75%)]" />
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600 px-4 py-6 relative">
        <div className="max-w-4xl mx-auto">
          {loading && messages.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-600 border-t-blue-500"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 blur-lg"></div>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center space-y-8 py-12">
              <div className="relative">
                <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-2xl">
                  <img src="chatbot.svg" className="h-24 w-24 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-3">
                  Ready to Master DSA?
                </h3>
                <p className="text-slate-400 text-2xl max-w-md mx-auto leading-relaxed p-10">
                  Struggling with a problem? I’ve got your back.
                </p>
              </div>
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
                <div className="flex justify-start mb-6">
                  <div className="bg-slate-700/80 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg border border-slate-600/50">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-2">
                        <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-slate-300 text-sm">
                        AI is thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <MessageInput onSend={handleSendMessage} disabled={sending} />
    </div>
  );
};

export default Chat;
