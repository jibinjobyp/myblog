import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../utils/Icons";
import "../styles/MessagePage.css";
import socket from "../socket";

const MessagePage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [showConversationList, setShowConversationList] = useState(true);
  const navigate = useNavigate();

  // useEffect(() =>{
  //   socket.emit('send','hello')
  // })

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowConversationList(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
          setConversations([
            {
              id: 1,
              userId: "user1",
              username: "John Doe",
              avatar: "",
              lastMessage: "Hey, how are you doing?",
              timestamp: "10:30 AM",
              unread: 2,
            },
            {
              id: 2,
              userId: "user2",
              username: "Jane Smith",
              avatar: "",
              lastMessage: "About our meeting tomorrow...",
              timestamp: "Yesterday",
              unread: 0,
            },
            {
              id: 3,
              userId: "user3",
              username: "Mike Johnson",
              avatar: "",
              lastMessage: "The documents are ready",
              timestamp: "Monday",
              unread: 1,
            },
          ]);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Failed to load conversations");
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    socket.emit("send", newMessage);

    // Update last message in conversations
    const updatedConversations = conversations.map((conv) =>
      conv.id === selectedConversation.id
        ? { ...conv, lastMessage: newMessage, timestamp: "Just now", unread: 0 }
        : conv
    );

    setConversations(updatedConversations);
    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    if (isMobileView) {
      setShowConversationList(false);
    }
  };

  const handleBackToList = () => {
    setShowConversationList(true);
  };

  return (
    <div className="message-page-container">
      {/* Header for mobile view */}
      {isMobileView && !showConversationList && (
        <div className="mobile-message-header">
          <button className="back-button" onClick={handleBackToList}>
            <FontAwesomeIcon icon={icons.solid.arrowLeft} />
          </button>
          <div className="recipient-info">
            <div className="avatar">
              {selectedConversation?.avatar ? (
                <img
                  src={selectedConversation.avatar}
                  alt={selectedConversation.username}
                />
              ) : (
                <div className="avatar-placeholder">
                  {selectedConversation?.username?.charAt(0) || ""}
                </div>
              )}
            </div>
            <h3>{selectedConversation?.username || ""}</h3>
          </div>
        </div>
      )}

      {/* Main header for desktop or conversation list */}
      {(showConversationList || !isMobileView) && (
        <div className="message-header">
          <h2>Messages</h2>
        </div>
      )}

      {error && (
        <div className="error-message">
          <FontAwesomeIcon icon={icons.solid.exclamationCircle} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="loading-messages">
          <div className="spinner"></div>
          <p>Loading conversations...</p>
        </div>
      ) : (
        <div className="message-layout">
          {/* Conversation List - shown on desktop or when in list view on mobile */}
          {(showConversationList || !isMobileView) && (
            <div className="conversation-list">
              <div className="search-bar">
                <FontAwesomeIcon
                  icon={icons.solid.search}
                  className="search-icon"
                />
                <input type="text" placeholder="Search conversations..." />
              </div>
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`conversation-item ${
                    selectedConversation?.id === conversation.id ? "active" : ""
                  }`}
                  onClick={() => handleSelectConversation(conversation)}
                >
                  <div className="avatar">
                    {conversation.avatar ? (
                      <img
                        src={conversation.avatar}
                        alt={conversation.username}
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        {conversation.username.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="conversation-details">
                    <div className="conversation-header">
                      <h4>{conversation.username}</h4>
                      <span className="timestamp">
                        {conversation.timestamp}
                      </span>
                    </div>
                    <p className="last-message">{conversation.lastMessage}</p>
                  </div>
                  {conversation.unread > 0 && (
                    <div className="unread-badge">{conversation.unread}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Message View - shown on desktop or when conversation selected on mobile */}
          {(!showConversationList || !isMobileView) && (
            <div
              className={`message-view ${selectedConversation ? "active" : ""}`}
            >
              {selectedConversation ? (
                <>
                  {!isMobileView && (
                    <div className="message-header">
                      <div className="recipient-info">
                        <div className="avatar">
                          {selectedConversation.avatar ? (
                            <img
                              src={selectedConversation.avatar}
                              alt={selectedConversation.username}
                            />
                          ) : (
                            <div className="avatar-placeholder">
                              {selectedConversation.username.charAt(0)}
                            </div>
                          )}
                        </div>
                        <h3>{selectedConversation.username}</h3>
                      </div>
                    </div>
                  )}

                  <div className="message-content">
                    <div className="message-date-divider">
                      <span>Today</span>
                    </div>
                    <div className="message-bubble received">
                      <p>Hey there!</p>
                      <span className="message-time">10:30 AM</span>
                    </div>
                    <div className="message-bubble sent">
                      <p>Hi! How are you?</p>
                      <span className="message-time">10:31 AM</span>
                    </div>
                    <div className="message-bubble received">
                      <p>I'm good, thanks for asking!</p>
                      <span className="message-time">10:32 AM</span>
                    </div>
                  </div>

                  <div className="message-input">
                    <button className="emoji-button">
                      <FontAwesomeIcon icon={icons.solid.smile} />
                    </button>
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <button className="send-button" onClick={handleSendMessage}>
                      <FontAwesomeIcon icon={icons.solid.paperPlane} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="no-conversation-selected">
                  <FontAwesomeIcon icon={icons.solid.commentDots} size="3x" />
                  <p>Select a conversation to start messaging</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessagePage;
