import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import InputArea from './components/InputArea';
import { FiMenu } from 'react-icons/fi';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Chat History States
  const [chatSessions, setChatSessions] = useState(() => {
    const saved = localStorage.getItem('aihub-chats');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentChatId, setCurrentChatId] = useState(null);

  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Derived state: what is currently on the screen
  const currentChat = chatSessions.find((chat) => chat.id === currentChatId);
  const messages = currentChat ? currentChat.messages : [];

  // Persist to local storage whenever chatSessions changes
  useEffect(() => {
    localStorage.setItem('aihub-chats', JSON.stringify(chatSessions));
  }, [chatSessions]);

  const createNewChat = () => {
    setCurrentChatId(null); // Null ID means a fresh, unsaved chat view
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  const loadChat = (id) => {
    setCurrentChatId(id);
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  const deleteChat = (id) => {
    setChatSessions((prev) => prev.filter((chat) => chat.id !== id));
    if (currentChatId === id) {
      setCurrentChatId(null);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (prompt) => {
    const newUserMsg = { role: 'user', content: prompt };
    let activeChatId = currentChatId;

    // If this is the very first message of a totally new chat, create the session first
    if (!activeChatId) {
      const newChat = {
        id: uuidv4(),
        title: prompt.length > 25 ? prompt.substring(0, 25) + '...' : prompt,
        messages: [newUserMsg]
      };
      setChatSessions((prev) => [newChat, ...prev]);
      setCurrentChatId(newChat.id);
      activeChatId = newChat.id;
    } else {
      // Otherwise, append to the existing active session
      setChatSessions((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? { ...chat, messages: [...chat.messages, newUserMsg] }
            : chat
        )
      );
    }

    setIsTyping(true);

    try {
      const apiUrl = import.meta.env.DEV ? 'http://localhost:3000/api/chat' : '/api/chat';
      const response = await axios.post(apiUrl, { prompt });
      const aiResponseMsg = { role: 'ai', content: response.data.response };

      setChatSessions((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? { ...chat, messages: [...chat.messages, aiResponseMsg] }
            : chat
        )
      );
    } catch (error) {
      console.error('Error fetching chat response:', error);
      const errorMsg = { role: 'ai', content: 'Sorry, I encountered an error connecting to the API. Please ensure the backend is running and the API key is valid.' };

      setChatSessions((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? { ...chat, messages: [...chat.messages, errorMsg] }
            : chat
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        chatSessions={chatSessions}
        currentChatId={currentChatId}
        createNewChat={createNewChat}
        loadChat={loadChat}
        deleteChat={deleteChat}
      />

      <main className="main-content">
        <header className="mobile-header">
          <button onClick={toggleSidebar} className="menu-btn">
            <FiMenu size={24} />
          </button>
          <h2>AI-Hub</h2>
        </header>

        <ChatArea messages={messages} isTyping={isTyping} messagesEndRef={messagesEndRef} />
        <InputArea onSendMessage={handleSendMessage} isTyping={isTyping} />
      </main>
    </div>
  );
}

export default App;
