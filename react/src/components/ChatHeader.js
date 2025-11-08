import React from 'react';
import './ChatHeader.css';

const ChatHeader = ({ username, onlineCount }) => {
  return (
    <div className="chat-header" data-easytag="id1-react/src/components/ChatHeader.js">
      <div className="header-content" data-easytag="id2-react/src/components/ChatHeader.js">
        <h1 className="chat-title" data-easytag="id3-react/src/components/ChatHeader.js">
          Групповой чат
        </h1>
        <div className="header-info" data-easytag="id4-react/src/components/ChatHeader.js">
          <div className="user-info" data-easytag="id5-react/src/components/ChatHeader.js">
            <span className="label" data-easytag="id6-react/src/components/ChatHeader.js">
              Ваше имя:
            </span>
            <span className="username" data-easytag="id7-react/src/components/ChatHeader.js">
              {username}
            </span>
          </div>
          <div className="online-info" data-easytag="id8-react/src/components/ChatHeader.js">
            <span className="online-dot" data-easytag="id9-react/src/components/ChatHeader.js"></span>
            <span className="online-text" data-easytag="id10-react/src/components/ChatHeader.js">
              Онлайн: {onlineCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
