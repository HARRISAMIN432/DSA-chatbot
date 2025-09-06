import { X, MessageSquare, Plus } from "lucide-react";
import { useChat } from "../context/ChatContext.jsx";
import { chatService } from "../services/chatService.js";
import { useEffect } from "react";

const Sidebar = ({ isOpen, onClose }) => {
  const { topics, setTopics, currentTopic, setCurrentTopic, clearMessages } =
    useChat();

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      const response = await chatService.getTopics();
      setTopics(response.topics || []);
    } catch (error) {
      console.error("Failed to load topics:", error);
    }
  };

  const handleTopicSelect = (topic) => {
    setCurrentTopic(topic);
    clearMessages();
    onClose();
  };

  const handleNewChat = () => {
    setCurrentTopic(null);
    clearMessages();
    onClose();
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 bg-gray-800 border-r border-gray-700 transform
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          transition-transform duration-300 ease-in-out
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Conversations
              </h2>
              <button
                onClick={onClose}
                className="lg:hidden p-1 rounded hover:bg-gray-700 transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <button
              onClick={handleNewChat}
              className="w-full mt-3 flex items-center space-x-2 px-3 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span className="text-white font-medium">New Chat</span>
            </button>
          </div>

          {/* Topics List */}
          <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
            {topics.length === 0 ? (
              <div className="text-center text-gray-400 mt-8">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No conversations yet</p>
                <p className="text-sm">Start a new chat to begin</p>
              </div>
            ) : (
              <div className="space-y-1">
                {topics.map((topic, index) => (
                  <button
                    key={index}
                    onClick={() => handleTopicSelect(topic)}
                    className={`
                      w-full text-left px-3 py-3 rounded-lg transition-colors
                      ${
                        currentTopic === topic
                          ? "bg-primary-500 text-white"
                          : "text-gray-300 hover:bg-gray-700"
                      }
                    `}
                  >
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate font-medium">{topic}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
