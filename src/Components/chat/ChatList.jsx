import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useChat } from "../../context/ChatContext";
import { Loader } from "lucide-react";

const ChatList = () => {
  const { chats, setSelectedChat, fetchChats, selectedChat, loading } =
    useChat();
  const [searchQuery, setSearchQuery] = useState("");
  const { currentUser } = useSelector((state) => state.user);

  // Filter chats based on search query
  const filteredChats = chats.filter((chat) => {
    const isCoach = currentUser?.userType === "Coach";
    const chatUser = isCoach ? chat.player : chat.coach;
    return chatUser?.email?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  useEffect(() => {
    fetchChats();
  }, []);
  if (loading)
    return (
      <div className="w-full flex justify-center items-center h-full animate-spin">
        <Loader />
      </div>
    );
  return (
    <div className="w-full flex bg-white">
      <div className="flex w-full">
        {/* Chat List */}
        <div className="w-full">
          <div className="bg-white h-full overflow-y-auto">
            {/* Search Bar */}
            <div className="flex w-[90%] mx-auto p-2 my-4 items-center gap-2 shadow-[inset_0px_0px_19px_-5px_rgba(0,0,0,0.12)] rounded-full">
              <FiSearch className="text-gray-500" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-sm text-gray-700"
              />
            </div>
            {/* Chat List */}
            <ul>
              {filteredChats.length > 0 ? (
                filteredChats.map((chat) => {
                  const isCoach = currentUser?.userType === "Coach";
                  const chatUser = isCoach ? chat.player : chat.coach;
                  const isSelected = selectedChat?._id === chat._id;
                  const unreadCount = isCoach
                    ? chat.unreadCountForCoach
                    : chat.unreadCountForPlayer;

                  return (
                    <div key={chat._id}>
                      <li
                        onClick={() => setSelectedChat(chat)}
                        className={`p-4 flex items-center gap-4 cursor-pointer ${
                          isSelected
                            ? "bg-[#bd63b5] text-white"
                            : "bg-white hover:bg-gray-100"
                        }`}
                      >
                        <img
                          src={
                            isCoach
                              ? chatUser?.profilePicture
                              : chatUser?.profilePic || "/default-avatar.png"
                          }
                          alt={chatUser?.email}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <p
                              className={`font-bold ${
                                isSelected ? "text-white" : "text-black"
                              }`}
                            >
                              {chatUser?.email}
                            </p>
                            {unreadCount > 0 && (
                              <span
                                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                  isSelected
                                    ? "bg-white text-[#bd63b5]"
                                    : "bg-[#bd63b5] text-white"
                                }`}
                              >
                                {unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </li>
                      <div className="border-b border-gray-200" />
                    </div>
                  );
                })
              ) : (
                <p className="p-4 text-center text-gray-500">
                  No chats available
                </p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
