import React from "react";

const TypingLoader: React.FC = () => (
  <div className="flex space-x-1">
    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
  </div>
);

export default TypingLoader;
