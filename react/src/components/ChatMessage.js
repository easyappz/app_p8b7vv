import React from 'react';
import './ChatMessage.css';

const ChatMessage = ({ message, isOwn, username }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div
      className={`chat-message ${isOwn ? 'own' : 'other'}`}
      data-easytag="id1-react/src/components/ChatMessage.js"
    >
      <div className="message-header" data-easytag="id2-react/src/components/ChatMessage.js">
        <span className="message-username" data-easytag="id3-react/src/components/ChatMessage.js">
          {message.username}
        </span>
        <span className="message-time" data-easytag="id4-react/src/components/ChatMessage.js">
          {formatTime(message.created_at)}
        </span>
      </div>
      <div className="message-text" data-easytag="id5-react/src/components/ChatMessage.js">
        {message.text}
      </div>
    </div>
  );
};

export default ChatMessage;
