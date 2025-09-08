import { User, Bot, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";

const MessageBubble = ({ message, role }) => {
  const isUser = role === "user";
  const [msg, setMsg] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!message) return;

    let cleanMessage = message
      .replace(/^```html\s*/, "")
      .replace(/\s*```$/, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    setMsg(cleanMessage);
  }, [message]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(msg);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } mb-6 animate-fade-in`}
    >
      <div
        className={`flex space-x-4 max-w-4xl w-full ${
          isUser ? "flex-row-reverse space-x-reverse" : ""
        }`}
      >
        <div className="flex-shrink-0 relative">
          <div
            className={`
              w-10 h-10 rounded-xl flex items-center justify-center shadow-lg
              ${isUser ? "bg-gradient-to-br from-purple-500 to-pink-500" : ""}
            `}
          >
            {isUser ? (
              <User className="h-5 w-5 text-white" />
            ) : (
              <img src="chatbot.svg" className="h-5 w-5 text-white" />
            )}
          </div>

          {!isUser && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-800 animate-pulse"></div>
          )}
        </div>

        <div className="inline-block max-w-[75%]">
          <div
            className={`
              relative px-6 py-4 rounded-2xl shadow-lg backdrop-blur-sm border
              ${
                isUser
                  ? "bg-gradient-to-br from-purple-500/90 to-pink-500/90 text-white border-purple-400/20 ml-12"
                  : "bg-slate-800/80 text-slate-100 border-slate-700/50 mr-12"
              }
            `}
          >
            {!isUser && (
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-all duration-200 opacity-0 group-hover:opacity-100"
                title="Copy message"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-slate-400" />
                )}
              </button>
            )}

            <div className="group">
              {isUser ? (
                <p className="whitespace-pre-wrap leading-relaxed font-medium">
                  {msg}
                </p>
              ) : (
                <div
                  className="whitespace-pre-wrap leading-relaxed prose prose-invert max-w-none prose-code:bg-slate-700/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-900/50 prose-pre:border prose-pre:border-slate-600/30"
                  dangerouslySetInnerHTML={{ __html: msg }}
                />
              )}
            </div>

            <div
              className={`
                absolute top-4 w-3 h-3 rotate-45 border
                ${
                  isUser
                    ? "right-[-6px] bg-gradient-to-br from-purple-500/90 to-pink-500/90 border-purple-400/20 border-l-0 border-b-0"
                    : "left-[-6px] bg-slate-800/80 border-slate-700/50 border-r-0 border-t-0"
                }
              `}
            />
          </div>

          <div className={`mt-2 px-2 ${isUser ? "text-right" : "text-left"}`}>
            <span className="text-xs text-slate-500">
              {isUser ? "You" : "DSA Assistant"} •{" "}
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
