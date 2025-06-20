import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, ArrowRight } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const ChatBotAgent = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef();

  const fetchBotResponse = async (userMessage) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/chatBot/search`,
        { params: { query: userMessage } }
      );

      if (response.data.faqs?.length > 0) {
        return response.data.faqs[0].answer;
      }
      return "I couldn't find any information on that. Can you please rephrase or ask something else?";
    } catch (error) {
      console.error("Error fetching bot response:", error);
      return "Oops! Something went wrong. Please try again later.";
    }
  };

  const updateHistory = (text, role = "model", isError = false) => {
    setChatHistory((prev) => [...prev, { role, text, isError }]);
  };

  const generateBotResponse = async (userMessage) => {
    updateHistory("Thinking...", "model");
    const botResponse = await fetchBotResponse(userMessage);
    setChatHistory((prev) => [
      ...prev.filter((msg) => msg.text !== "Thinking..."),
      { role: "model", text: botResponse },
    ]);
  };

  const handleUserInput = async (userMessage) => {
    updateHistory(userMessage, "user");
    await generateBotResponse(userMessage);
  };

  useEffect(() => {
    if (showChatbot && chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory, showChatbot]);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        onClick={() => setShowChatbot((prev) => !prev)}
        className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
          showChatbot ? "bg-rose-500" : "bg-pink-500"
        }`}
      >
        <AnimatePresence>
          {!showChatbot ? (
            <motion.div
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              className="text-white"
            >
              <MessageCircle size={28} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              className="text-white"
            >
              <X size={28} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {showChatbot && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 20 }}
            className="absolute bottom-20 right-0 w-96 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col"
            style={{ height: "600px" }}
          >
            {/* Header */}
            <div className="bg-pink-500 text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ChatBotIcon />
                <h2 className="text-xl font-bold">Ball Control AI</h2>
              </div>
              <button
                onClick={() => setShowChatbot(false)}
                className="p-1 rounded-full hover:bg-pink-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Body */}
            <div
              ref={chatBodyRef}
              className="flex-1 p-4 overflow-y-auto space-y-4"
            >
              <div className="flex gap-3">
                <ChatBotIcon />
                <div className="bg-gray-100 px-4 py-3 rounded-lg rounded-tl-none max-w-[80%]">
                  <p>
                    Hey there 👋 <br /> How can I help you today?
                  </p>
                </div>
              </div>

              {chatHistory.map((chat, index) => (
                <ChatMessage key={index} chat={chat} />
              ))}
            </div>

            {/* Footer */}
            <div className="border-t p-4 bg-white">
              <ChatForm handleUserInput={handleUserInput} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ChatMessage = ({ chat }) => {
  return (
    <div
      className={`flex gap-3 ${
        chat.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      {chat.role === "model" && <ChatBotIcon />}
      <div
        className={`px-4 py-3 rounded-lg max-w-[80%] ${
          chat.role === "user"
            ? "bg-pink-500 text-white rounded-br-none"
            : "bg-gray-100 rounded-tl-none"
        }`}
      >
        <p dangerouslySetInnerHTML={{ __html: chat.text }} />
      </div>
    </div>
  );
};

const ChatForm = ({ handleUserInput }) => {
  const inputRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = inputRef.current.value.trim();
    if (!message) return;
    inputRef.current.value = "";
    handleUserInput(message);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 items-center bg-gray-50 rounded-lg p-2"
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="Type your message..."
        className="flex-1 p-2 bg-transparent outline-none"
        onKeyDown={handleKeyDown}
      />
      <button
        type="submit"
        className="p-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
      >
        <Send size={18} />
      </button>
    </form>
  );
};

const ChatBotIcon = () => (
  <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      className="w-6 h-6 fill-pink-500"
    >
      <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z" />
    </svg>
  </div>
);

export default ChatBotAgent;
