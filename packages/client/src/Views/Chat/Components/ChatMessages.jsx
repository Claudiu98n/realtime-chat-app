import React, { useState, useEffect } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import axios from "axios";
import cogoToast from "cogo-toast";

const ChatMessages = ({ socket, room, activeReceiver }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const formatDate = (date) => {
    // format date to date-time
    return new Date(date).toLocaleDateString() + " " + new Date(date).toLocaleTimeString();
  };

  const sendMessage = async () => {
    // send message through socket
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: localStorage.getItem("id"),
        message: currentMessage,
      };

      await socket.emit("send_message", messageData);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    if (!room) return;
    // get all previous messages corresponding to room every time it is changed
    const fetchData = async () => {
      try {
        // if response status is 200, set state with users list
        const response = await axios.get(
          process.env.REACT_APP_SERVER_URL + "/api/private/messages",
          {
            params: {
              room: room,
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
          }
        );
        if (response.status === 200) {
          setMessageList(response.data);
        }
      } catch (err) {
        console.log(err);
        if (err.response && err.response.data) {
          return cogoToast.error(err.response.data.message);
        }
      }
    };

    fetchData();
  }, [room]);

  useEffect(() => {
    // receive message through socket
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      {room ? (
        <React.Fragment>
          <div className="chat-body">
            <ScrollToBottom className="message-container">
              {messageList.map((messageContent, index) => {
                return (
                  <div
                    key={index}
                    className="message"
                    id={
                      messageContent.UserId === Number(localStorage.getItem("id")) ? "you" : "other"
                    }
                  >
                    <div>
                      <div className="message-content">
                        <p>{messageContent.text}</p>
                      </div>
                      <div className="message-meta">
                        <p id="time">{formatDate(messageContent.createdAt)}</p>
                        <p id="author">
                          {messageContent.UserId === Number(localStorage.getItem("id"))
                            ? "you"
                            : activeReceiver}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </ScrollToBottom>
          </div>
          <div className="chat-footer">
            <input
              type="text"
              value={currentMessage}
              placeholder="Start typing your message here..."
              onChange={(event) => {
                setCurrentMessage(event.target.value);
              }}
              onKeyPress={(event) => {
                event.key === "Enter" && sendMessage();
              }}
            />
            <button onClick={sendMessage}>&#9658;</button>
          </div>
        </React.Fragment>
      ) : (
        <div className="chat-body h-100">
          <p className="p-3 fw-bold">Choose the user you want to start chatting with.</p>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
