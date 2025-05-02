import ChatList from "../../../Components/chat/ChatList";
import ChatWindow from "../../../Components/chat/ChatWindow";

const ChatPage = () => {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="w-full h-[80vh] flex bg-white shadow-lg">
        <div className="flex w-full">
          <div className="w-1/3 border-r border-gray-200">
            <ChatList />
          </div>
          <div className="w-2/3">
            <ChatWindow />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
