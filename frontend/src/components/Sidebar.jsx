import { X, Plus, Search, Trash2 } from "lucide-react";
import { useChat } from "../context/ChatContext.jsx";
import { chatService } from "../services/chatService.js";
import { useEffect, useState } from "react";

const Sidebar = ({ isOpen, onClose }) => {
  const {
    topics,
    setTopics,
    currentTopic,
    setCurrentTopic,
    clearMessages,
    deleteTopic,
  } = useChat();
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredTopic, setHoveredTopic] = useState(null);

  useEffect(() => {
    loadTopics();
  }, []);

  const handleDeleteTopic = async (topic) => {
    try {
      await chatService.deleteTopic(topic);
      deleteTopic(topic);
      setCurrentTopic(null);
    } catch (error) {
      console.error("Failed to delete topic:", error);
    }
  };

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

  const filteredTopics = topics.filter((topic) =>
    topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const truncateText = (text, maxLength = 40) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <>
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
          onClick={onClose}
        />
      )}

      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-80 bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 
          transform transition-all duration-300 ease-out
          ${
            isOpen
              ? "translate-x-0 shadow-2xl"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div className="flex flex-col h-full relative">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800/20 to-slate-900/40" />

          <div className="relative p-6 border-b border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Conversations</h2>
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200 hover:scale-105"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <button
              onClick={handleNewChat}
              className="
                w-full flex items-center space-x-3 px-4 py-3.5 
                bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600
                rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-500/25
                hover:scale-105 active:scale-95 group
              "
            >
              <div className="p-1 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                <Plus className="h-4 w-4 text-white" />
              </div>
              <span className="text-white font-semibold">New Conversation</span>
            </button>

            {topics.length > 0 && (
              <div className="relative mt-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="
                    w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 
                    rounded-lg text-white placeholder-slate-500 focus:outline-none 
                    focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                    transition-all duration-200
                  "
                />
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-600 p-3 relative">
            {filteredTopics.length === 0 ? (
              <div className="text-center text-slate-400 mt-12 px-4">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-800/50">
                  <img src="message.svg" className="h-8 w-8 opacity-50" />
                </div>
                {topics.length === 0 ? (
                  <>
                    <p className="font-medium mb-1">No conversations yet</p>
                    <p className="text-sm text-slate-500">
                      Start a new chat to begin learning DSA
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-medium mb-1">No matches found</p>
                    <p className="text-sm text-slate-500">
                      Try a different search term
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTopics.map((topic, index) => (
                  <div
                    key={index}
                    className="relative group"
                    onMouseEnter={() => setHoveredTopic(index)}
                    onMouseLeave={() => setHoveredTopic(null)}
                  >
                    <button
                      onClick={() => handleTopicSelect(topic)}
                      className={`
                        w-full text-left px-4 py-3.5 rounded-xl transition-all duration-200
                        hover:scale-105 active:scale-95 relative overflow-hidden
                        ${
                          currentTopic === topic
                            ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-white shadow-lg"
                            : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                        }
                      `}
                    >
                      {currentTopic === topic && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-r-full" />
                      )}

                      <div className="flex items-center space-x-3 ml-2">
                        <div
                          className={`p-1.5 rounded-lg transition-colors ${
                            currentTopic === topic
                              ? "bg-blue-500/30"
                              : "bg-slate-700/50 group-hover:bg-slate-600/50"
                          }`}
                        >
                          <img src="message.svg" className="h-4 w-4" />
                        </div>
                        <span className="font-medium flex-1 min-w-0">
                          {truncateText(topic)}
                        </span>
                      </div>
                    </button>

                    {hoveredTopic === index && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1 bg-slate-800/90 backdrop-blur-sm rounded-lg p-1">
                        <button
                          className="p-1.5 rounded hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
                          title="More options"
                        ></button>
                        <button
                          onClick={() => handleDeleteTopic(topic)}
                          className="p-1.5 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                          title="Delete conversation"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
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
