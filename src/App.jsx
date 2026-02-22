import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import InputArea from './components/InputArea';
import { FiMenu } from 'react-icons/fi';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

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
    // Add user message
    const newUserMsg = { role: 'user', content: prompt };
    setMessages((prev) => [...prev, newUserMsg]);
    setIsTyping(true);

    try {
      // Determine the API URL based on environment
      const apiUrl = import.meta.env.DEV ? 'http://localhost:3000/api/chat' : '/api/chat';

      const response = await axios.post(apiUrl, { prompt });

      const aiResponseMsg = { role: 'ai', content: response.data.response };
      setMessages((prev) => [...prev, aiResponseMsg]);
    } catch (error) {
      console.error('Error fetching chat response:', error);
      const errorMsg = { role: 'ai', content: 'Sorry, I encountered an error connecting to the API. Please ensure the backend is running and the API key is valid.' };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="app-container">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

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
