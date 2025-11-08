import React, { useState, useEffect, useCallback } from 'react';
import ErrorBoundary from './ErrorBoundary';
import ChatHeader from './components/ChatHeader';
import ChatMessages from './components/ChatMessages';
import ChatInput from './components/ChatInput';
import { getMessages, sendMessage, getOnlineCount } from './api/messages';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [onlineCount, setOnlineCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sendDisabled, setSendDisabled] = useState(false);

  // Generate or retrieve username from sessionStorage
  useEffect(() => {
    let storedUsername = sessionStorage.getItem('chatUsername');
    if (!storedUsername) {
      const adjectives = ['Быстрый', 'Умный', 'Веселый', 'Добрый', 'Смелый', 'Яркий', 'Тихий', 'Громкий'];
      const nouns = ['Тигр', 'Лев', 'Орел', 'Дельфин', 'Волк', 'Медведь', 'Лиса', 'Кот'];
      const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
      const randomNum = Math.floor(Math.random() * 1000);
      storedUsername = `${randomAdj}${randomNoun}${randomNum}`;
      sessionStorage.setItem('chatUsername', storedUsername);
    }
    setUsername(storedUsername);
  }, []);

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    try {
      const data = await getMessages();
      setMessages(data.messages || data || []);
      if (data.username) {
        setUsername(data.username);
        sessionStorage.setItem('chatUsername', data.username);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Не удалось загрузить сообщения');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch online count
  const fetchOnlineCount = useCallback(async () => {
    try {
      const data = await getOnlineCount();
      setOnlineCount(data.count || data.online_count || 0);
    } catch (err) {
      console.error('Error fetching online count:', err);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchMessages();
    fetchOnlineCount();
  }, [fetchMessages, fetchOnlineCount]);

  // Poll for new messages every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessages();
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchMessages]);

  // Poll for online count every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchOnlineCount();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchOnlineCount]);

  // Handle send message
  const handleSendMessage = async (text) => {
    if (sendDisabled) return;

    setSendDisabled(true);
    
    try {
      await sendMessage(text);
      await fetchMessages();
      setError(null);
    } catch (err) {
      console.error('Error sending message:', err);
      if (err.response?.status === 429) {
        setError('Слишком много сообщений. Пожалуйста, подождите.');
      } else if (err.response?.data?.text) {
        setError(err.response.data.text[0]);
      } else {
        setError('Не удалось отправить сообщение');
      }
    }

    // Re-enable send button after 2 seconds (rate limiting)
    setTimeout(() => {
      setSendDisabled(false);
    }, 2000);
  };

  // Register routes for debugging
  useEffect(() => {
    if (window.handleRoutes) {
      window.handleRoutes(['/']);
    }
  }, []);

  return (
    <ErrorBoundary>
      <div className="App" data-easytag="id1-react/src/App.js">
        <ChatHeader username={username} onlineCount={onlineCount} />
        <ChatMessages
          messages={messages}
          username={username}
          loading={loading}
          error={error}
        />
        <ChatInput onSend={handleSendMessage} disabled={sendDisabled} />
      </div>
    </ErrorBoundary>
  );
}

export default App;
