import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import "./Chatbot.css";
import ChatBotIcon from "./ChatBotIcon";

// ChatBotIcon Component

// ChatMessage Component
const ChatMessage = ({ chat }) => (
  <div
    className={`message ${chat.role === "model" ? "bot" : "user"}-message ${
      chat.isError ? "error" : ""
    }`}
  >
    {chat.role === "model" && <ChatBotIcon />}
    <p
      className="text-message"
      dangerouslySetInnerHTML={{ __html: chat.text }}
    />
  </div>
);

// ChatForm Component
const ChatForm = ({ handleUserInput }) => {
  const inputRef = useRef();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;
    inputRef.current.value = "";
    handleUserInput(userMessage);
  };

  return (
    <form action="#" className="chat-form ">
      <input
        ref={inputRef}
        type="text"
        placeholder="Type your message..."
        className="message-input"
        required
      />
      <div
        className="text-main-dark pr-2 cursor-pointer"
        onClick={handleFormSubmit}
      >
        <Send />
      </div>
    </form>
  );
};

// Main ChatBotAgent Component
const ChatBotAgent = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef();

  // Fetch data from the backend based on the user's query
  const fetchBotResponse = async (userMessage) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/chatBot/search`,
        {
          params: { query: userMessage },
        }
      );
      console.log(response);

      // If data is found, return the first FAQ's answer
      if (response.data.faqs && response.data.faqs.length > 0) {
        return response.data.faqs[0].answer; // Return the first FAQ's answer
      } else {
        return "I couldn't find any information on that. Can you please rephrase or ask something else?";
      }
    } catch (error) {
      console.error("Error fetching bot response:", error);
      return "Oops! Something went wrong. Please try again later.";
    }
  };

  // Update chat history with user and bot messages
  const updateHistory = (text, role = "model", isError = false) => {
    setChatHistory((prev) => [...prev, { role, text, isError }]);
  };

  // Generate bot response based on user input
  const generateBotResponse = async (userMessage) => {
    // Add a "Thinking..." message while waiting for the response
    updateHistory("Thinking...", "model");

    // Fetch the bot response from the backend
    const botResponse = await fetchBotResponse(userMessage);

    // Remove the "Thinking..." message and add the actual response
    setChatHistory((prev) => [
      ...prev.filter((msg) => msg.text !== "Thinking..."),
      { role: "model", text: botResponse },
    ]);
  };

  // Handle user input
  const handleUserInput = async (userMessage) => {
    // Add the user's message to the chat history
    updateHistory(userMessage, "user");

    // Generate and add the bot's response
    await generateBotResponse(userMessage);
  };

  // Scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    if (showChatbot && chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory, showChatbot]);

  return (
    <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
      <div
        onClick={() => setShowChatbot((prev) => !prev)}
        id="chatbot-toggler"
        className="z-50"
      >
        <span className="material-symbols-outlined">
          <MessageCircle size={35} />
        </span>
        <span className="material-symbols-outlined">
          <X size={35} />
        </span>
      </div>

      <AnimatePresence>
        {showChatbot && (
          <motion.div
            className="chatbot-popup"
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            {/* Chatbot Header */}
            <div className="chat-header">
              <div className="header-info">
                <ChatBotIcon />
                <h2 className="logo-text">Ball Contrl AI</h2>
              </div>
              <div
                onClick={() => setShowChatbot((prev) => !prev)}
                className="text-white cursor-pointer hover:bg-pink-200 rounded-full p-1 duration-200"
              >
                <X />
              </div>
            </div>

            {/* Chatbot body */}
            <div ref={chatBodyRef} className="chat-body">
              <motion.div className="message bot-message">
                <ChatBotIcon />
                <p className="text-message">
                  Hey there 👋 <br /> How can I help you today?
                </p>
              </motion.div>

              {chatHistory.map((chat, index) => (
                <ChatMessage key={index} chat={chat} />
              ))}
            </div>

            {/* Chatbot footer */}
            <div className="chat-footer">
              <ChatForm handleUserInput={handleUserInput} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBotAgent;
