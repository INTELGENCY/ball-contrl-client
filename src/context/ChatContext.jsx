import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../utils/socket";
import axios from "axios";
import { useSelector } from "react-redux";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const userId = currentUser?._id;
  const role = currentUser?.userType?.toLowerCase();

  const baseUrl = import.meta.env.VITE_BASE_URL;

  const url =
    role === "player"
      ? `${baseUrl}/chats/my-chats?playerId=${userId}`
      : `${baseUrl}/chats/my-chats?coachId=${userId}`;

  // Connect to socket and register user
  useEffect(() => {
    console.log("🔗 Connecting to socket...");
    socket.on("connect", () => {
      console.log("✅ Connected to socket with ID:", socket.id);
    });
    socket.on("connect_error", (err) => {
      console.log("❌ Connection error:", err);
    });
    socket.emit("registerUser", userId);

    return () => {
      socket.off("connect");
      socket.off("connect_error");
    };
  }, [userId]);

  // Join room and listen for messages when a chat is selected
  useEffect(() => {
    if (!selectedChat) return;

    // Join the chat room
    socket.emit("joinRoom", {
      bookingId: selectedChat.bookingId._id,
      playerId: selectedChat.player._id,
      coachId: selectedChat.coach._id,
    });

    // Load messages for the selected chat
    socket.on("loadMessages", (msgs) => {
      setMessages(msgs);
    });

    // Listen for new messages
    socket.on("newMessage", (newMsgs) => {
      console.log("New message received:", newMsgs);
      setMessages((prevMessages) => [...prevMessages, ...newMsgs]);
    });

    return () => {
      socket.off("loadMessages");
      socket.off("newMessage");
    };
  }, [selectedChat]);

  // Fetch chats for the current user (player or coach)
  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(url);
      setChats(response.data.chats);
      setSelectedChat(chats[0]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching chats:", error);
    }
  };

  // Send a message in the selected chat
  const sendMessage = (text) => {
    if (!selectedChat) return;

    socket.emit("sendMessage", {
      bookingId: selectedChat.bookingId._id,
      senderId: userId,
      senderType: role,
      text,
      receiverId:
        role === "player" ? selectedChat.coach._id : selectedChat.player._id,
    });
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        messages,
        selectedChat,
        setSelectedChat,
        fetchChats,
        sendMessage,
        loading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
