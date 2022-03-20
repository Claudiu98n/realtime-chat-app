import React from "react";

const ChatEntry = ({ chatUsers, handleJoinUser, room, setActiveReceiver }) => {
  const handleStartChatting = (user) => {
    const emitterId = Number(localStorage.getItem("id"));
    const receiverId = Number(user.id);

    setActiveReceiver(user.username);

    const room = [emitterId, receiverId].sort().join("-");

    handleJoinUser(room);
  };

  return (
    <div className="chat-users">
      {chatUsers.length > 0 ? (
        chatUsers.map((user, index) => (
          <div
            onClick={() => handleStartChatting(user)}
            key={index}
            className={`join-user d-flex align-items-center flex-wrap gap-2 ${
              room &&
              room.split("-").find((id) => id !== localStorage.getItem("id")) === user.id.toString()
                ? "active"
                : ""
            }`}
          >
            <div className="user-avatar">{user.username.slice(0, 2)}</div>
            <p className="mb-0 fw-bold">{user.username}</p>
          </div>
        ))
      ) : (
        <p className="py-3 text-center">There are no users available.</p>
      )}
    </div>
  );
};

export default ChatEntry;
