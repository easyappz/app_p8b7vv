import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import './ChatMessages.css';

const ChatMessages = ({ messages, username, loading, error }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading && messages.length === 0) {
    return (
      <div className="messages-container" data-easytag="id1-react/src/components/ChatMessages.js">
        <div className="loading-message" data-easytag="id2-react/src/components/ChatMessages.js">
          Загрузка сообщений...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="messages-container" data-easytag="id3-react/src/components/ChatMessages.js">
        <div className="error-container" data-easytag="id4-react/src/components/ChatMessages.js">
          <div className="error-title" data-easytag="id5-react/src/components/ChatMessages.js">
            Ошибка загрузки
          </div>
          <div className="error-text" data-easytag="id6-react/src/components/ChatMessages.js">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-container" data-easytag="id7-react/src/components/ChatMessages.js">
      <div className="messages-list" data-easytag="id8-react/src/components/ChatMessages.js">
        {messages.length === 0 ? (
          <div className="empty-message" data-easytag="id9-react/src/components/ChatMessages.js">
            Пока нет сообщений. Будьте первым!
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isOwn={message.username === username}
              username={username}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessages;
