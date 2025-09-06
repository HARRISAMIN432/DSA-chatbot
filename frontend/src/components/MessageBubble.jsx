import { User, Bot } from "lucide-react";

const MessageBubble = ({ message, role }) => {
  const isUser = role === "user";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } mb-4 animate-slide-up`}
    >
      <div
        className={`flex space-x-3 max-w-3xl ${
          isUser ? "flex-row-reverse space-x-reverse" : ""
        }`}
      >
        <div
          className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
          ${isUser ? "bg-primary-500" : "bg-gray-600"}
        `}
        >
          {isUser ? (
            <User className="h-4 w-4 text-white" />
          ) : (
            <Bot className="h-4 w-4 text-white" />
          )}
        </div>

        <div
          className={`
          px-4 py-3 rounded-2xl shadow-lg
          ${isUser ? "bg-primary-500 text-white" : "bg-gray-700 text-gray-100"}
        `}
        >
          <p className="whitespace-pre-wrap leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
