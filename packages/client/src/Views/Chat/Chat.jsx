import React, { useEffect, useState } from "react";
import "./Chat.css";
import io from "socket.io-client";
import cogoToast from "cogo-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import ChatEntry from "./Components/ChatEntry";
import ChatMessages from "./Components/ChatMessages";

const socket = io.connect("http://localhost:5000", {
  extraHeaders: {
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
  },
});

const Chat = () => {
  const [chatUsers, setChatUsers] = useState([]);
  const [room, setRoom] = useState(null);
  const [activeReceiver, setActiveReceiver] = useState("");

  const navigate = useNavigate();

  const handleJoinUser = (room) => {
    // change room with users id concatenated
    socket.emit("join_room", room);
    setRoom(room);
  };

  const handleSignOut = () => {
    // remove jwt from local storage and route to homepage
    localStorage.removeItem("jwt");
    navigate("/");
    cogoToast.success("Logged out succesfully");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // if response status is 200, set state with users list
        const response = await axios.get(
          process.env.REACT_APP_SERVER_URL + "/api/auth/private/users",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
          }
        );
        if (response.status === 200) {
          setChatUsers(response.data);
        }
      } catch (err) {
        console.log(err);
        if (err.response.status) {
          switch (err.response.status) {
            case 401:
              navigate("/");
              localStorage.removeItem("jwt");
              return cogoToast.error("Please log in again");
            default:
              return cogoToast.error(err.response.data.message);
          }
        }
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div className="h-100">
      <div className="chat-header d-flex justify-content-between align-items-center">
        <p className="mb-0">Realtime Chat</p>
        <button onClick={handleSignOut} className="btn btn-warning">
          Sign out
        </button>
      </div>
      <div className="d-flex chat-container">
        <ChatEntry
          chatUsers={chatUsers}
          handleJoinUser={handleJoinUser}
          room={room}
          setActiveReceiver={setActiveReceiver}
        />
        <ChatMessages
          socket={socket}
          username={localStorage.getItem("username")}
          room={room}
          activeReceiver={activeReceiver}
        />
      </div>
    </div>
  );
};

export default Chat;
