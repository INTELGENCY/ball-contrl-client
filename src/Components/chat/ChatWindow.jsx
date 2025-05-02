import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { FiPhone, FiSend, FiVideo } from "react-icons/fi";
import { HiDotsVertical } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useChat } from "../../context/ChatContext";
import { Loader } from "lucide-react";

const ChatWindow = ({ handleCloseChatModal }) => {
  const { messages, selectedChat, sendMessage, loading } = useChat();
  const messagesEndRef = useRef(null);
  const [message, setMessage] = useState("");
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Determine the chat user's details based on the logged-in user's role
  const isCoach = currentUser?.userType === "Coach";
  const chatUser = isCoach ? selectedChat?.player : selectedChat?.coach;

  if (loading)
    return (
      <div className="w-full flex justify-center items-center h-full animate-spin">
        <Loader />
      </div>
    );

  return (
    <div className="flex flex-col h-[80vh] bg-gray-100 shadow-lg rounded-lg">
      {/* Header */}
      {selectedChat ? (
        <>
          <div className="flex items-center justify-between p-4 bg-white shadow-md rounded-t-lg">
            <div className="flex items-center gap-3">
              <img
                src={
                  isCoach
                    ? chatUser?.profilePicture
                    : chatUser?.profilePic || "/default-avatar.png"
                }
                alt={chatUser?.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h2 className="font-semibold text-gray-900">
                  {chatUser?.username ||
                    chatUser?.email.substring(0, 6) + "..."}
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <FiPhone className="cursor-pointer" />
              <FiVideo className="cursor-pointer" />
              <HiDotsVertical className="cursor-pointer" />
              <button
                onClick={handleCloseChatModal}
                className="text-gray-600 hover:text-red-500"
              >
                ✖
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((msg) => {
              const isSender = msg.sender === currentUser?._id;
              return (
                <div
                  key={msg._id}
                  className={`flex items-center ${
                    isSender ? "justify-end" : "justify-start"
                  }`}
                  onMouseEnter={() => setHoveredMessageId(msg._id)}
                  onMouseLeave={() => setHoveredMessageId(null)}
                >
                  <div
                    className={`relative max-w-[70%] p-3 rounded-xl shadow-sm text-sm leading-tight flex gap-4 ${
                      isSender
                        ? "bg-main-darker text-white rounded-br-none"
                        : "bg-white text-gray-900 rounded-bl-none border"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p
                      className={`text-[8px]   mt-1 ${
                        isSender ? "text-white" : "text-gray-700"
                      } text-right`}
                    >
                      {dayjs(msg.timestamp).format("h:mm A")}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Field */}
          <div className="flex items-center p-4 bg-white border-t border-gray-300 rounded-b-lg">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 p-2 rounded-lg border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 p-2 text-main-dark hover:text-main-darker"
            >
              <FiSend size={20} />
            </button>
          </div>
        </>
      ) : (
        // Display when no chat is selected
        <div className="flex-1 flex flex-col justify-center items-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No Chat Selected
            </h2>
            <p className="text-gray-500">Select a chat to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
