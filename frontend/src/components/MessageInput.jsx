import { Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const MessageInput = ({ onSend, disabled }) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  }, [message]);

  const quickActions = [];

  return (
    <div className="relative bg-slate-800/50 backdrop-blur-xl border-t border-slate-700/50 p-4">
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />

      <form onSubmit={handleSubmit} className="relative">
        <div className="max-w-4xl mx-auto">
          <div
            className={`
              relative flex items-end space-x-3 p-3 rounded-2xl transition-all duration-300
              ${
                isFocused
                  ? "bg-slate-700/80 border-2 border-blue-500/50 shadow-lg shadow-blue-500/10"
                  : "bg-slate-700/60 border-2 border-slate-600/30 hover:border-slate-600/50"
              }
            `}
          >
            <div className="flex items-center space-x-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  type="button"
                  className={`p-2 rounded-lg transition-all duration-200 hover:bg-slate-600/50 ${action.color}`}
                  title={action.label}
                >
                  <action.icon className="h-4 w-4" />
                </button>
              ))}
            </div>

            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Ask me about algorithms, data structures, complexity analysis..."
                rows={1}
                disabled={disabled}
                className="
                  w-full resize-none bg-transparent text-white placeholder-slate-400
                  focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed
                  scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-600
                  py-2 px-0 leading-relaxed
                "
                style={{
                  minHeight: "24px",
                  maxHeight: "120px",
                }}
              />

              {message.length > 200 && (
                <div className="absolute bottom-1 right-2 text-xs text-slate-500">
                  {message.length}/1000
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!message.trim() || disabled}
              className="
                relative p-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600
                disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed
                text-white rounded-xl transition-all duration-200 shadow-lg
                hover:shadow-blue-500/25 hover:scale-105 active:scale-95
                disabled:hover:scale-100 disabled:shadow-none
                group overflow-hidden
              "
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 group-disabled:opacity-0 transition-opacity duration-300" />

              {disabled ? (
                <div className="relative w-5 h-5 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                </div>
              ) : (
                <Send className="relative h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
