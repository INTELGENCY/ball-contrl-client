import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../utils/socket";
import axios from "axios";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [searchParams] = useSearchParams();
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [unreadCount, setUnreadCount] = useState(0);
  const userId = currentUser?._id;
  const role = currentUser?.userType?.toLowerCase();

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const bookingIdFromUrl = searchParams.get("booking");
  console.log("this is booking", bookingIdFromUrl);

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

  // Fetch chats and select the appropriate chat based on URL or first chat
  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(url);
      const fetchedChats = response.data.chats;
      setChats(fetchedChats);

      // Select chat based on bookingId from URL if available
      if (bookingIdFromUrl && fetchedChats.length > 0) {
        const chatFromBooking = fetchedChats.find(
          (chat) => chat.bookingId._id === bookingIdFromUrl
        );
        if (chatFromBooking) {
          setSelectedChat(chatFromBooking);
        } else {
          setSelectedChat(fetchedChats[0]);
        }
      } else if (fetchedChats.length > 0) {
        setSelectedChat(fetchedChats[0]);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching chats:", error);
    }
  };

  // Join room and listen for messages when a chat is selected
  useEffect(() => {
    if (!selectedChat) return;

    // Join the chat room
    socket.emit("joinRoom", {
      bookingId: selectedChat.bookingId._id,
      playerId: selectedChat.player._id,
      coachId: selectedChat.coach._id,
    });

    // Mark messages as read
    socket.emit("readMessages", {
      bookingId: selectedChat?.bookingId?._id,
      userId: userId,
      userType: role,
    });

    // Optimistically update the chats list locally
    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat._id === selectedChat._id) {
          return {
            ...chat,
            unreadCountForPlayer:
              role === "player" ? 0 : chat.unreadCountForPlayer,
            unreadCountForCoach:
              role === "coach" ? 0 : chat.unreadCountForCoach,
          };
        }
        return chat;
      })
    );

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
  }, [selectedChat, userId, role]);

  // Calculate unread messages count
  useEffect(() => {
    if (chats && chats.length > 0) {
      const totalUnread = chats.reduce((acc, chat) => {
        if (role === "coach") {
          return acc + (chat.unreadCountForCoach || 0);
        } else {
          return acc + (chat.unreadCountForPlayer || 0);
        }
      }, 0);
      setUnreadCount(totalUnread);
    }
  }, [chats, role, selectedChat]);

  // Initial fetch when component mounts
  useEffect(() => {
    fetchChats();
  }, []);

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
        unreadCount,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
