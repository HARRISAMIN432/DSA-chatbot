import { Send } from "lucide-react";
import { useState } from "react";

const MessageInput = ({ onSend, disabled }) => {
  const [message, setMessage] = useState("");

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

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-gray-800 border-t border-gray-700"
    >
      <div className="max-w-4xl mx-auto flex space-x-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me about Data Structures & Algorithms..."
          rows={1}
          disabled={disabled}
          className="
            flex-1 resize-none rounded-lg px-4 py-3
            bg-gray-700 text-white placeholder-gray-400
            border border-gray-600 focus:border-primary-500 focus:ring-1 focus:ring-primary-500
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
          "
          style={{ minHeight: "50px", maxHeight: "120px" }}
        />
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="
            px-4 py-3 bg-primary-500 hover:bg-primary-600 
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-500
            text-white rounded-lg transition-colors duration-200
            flex items-center justify-center
          "
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
