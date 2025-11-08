import React, { useState } from 'react';
import './ChatInput.css';

const ChatInput = ({ onSend, disabled }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const maxLength = 500;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!text.trim()) {
      setError('Сообщение не может быть пустым');
      return;
    }

    if (text.length > maxLength) {
      setError(`Максимальная длина сообщения ${maxLength} символов`);
      return;
    }

    onSend(text);
    setText('');
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);
    if (error) {
      setError('');
    }
  };

  const remainingChars = maxLength - text.length;
  const isOverLimit = remainingChars < 0;

  return (
    <form
      className="chat-input-form"
      onSubmit={handleSubmit}
      data-easytag="id1-react/src/components/ChatInput.js"
    >
      <div className="input-wrapper" data-easytag="id2-react/src/components/ChatInput.js">
        <textarea
          className={`message-input ${isOverLimit ? 'error' : ''}`}
          value={text}
          onChange={handleChange}
          placeholder="Введите сообщение..."
          disabled={disabled}
          rows="3"
          data-easytag="id3-react/src/components/ChatInput.js"
        />
        <div
          className={`char-counter ${isOverLimit ? 'over-limit' : ''}`}
          data-easytag="id4-react/src/components/ChatInput.js"
        >
          {text.length} / {maxLength}
        </div>
      </div>
      {error && (
        <div className="error-message" data-easytag="id5-react/src/components/ChatInput.js">
          {error}
        </div>
      )}
      <button
        type="submit"
        className="send-button"
        disabled={disabled || !text.trim() || isOverLimit}
        data-easytag="id6-react/src/components/ChatInput.js"
      >
        {disabled ? 'Отправка...' : 'Отправить'}
      </button>
    </form>
  );
};

export default ChatInput;
