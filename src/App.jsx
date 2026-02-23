import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import InputArea from './components/InputArea';
import Modal from './components/Modal';
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

  // Phase 3 States
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('aihub-profile');
    return saved ? JSON.parse(saved) : { name: 'User', avatar: '🐱' };
  });

  const [systemPrompt, setSystemPrompt] = useState(() => {
    const saved = localStorage.getItem('aihub-system-prompt');
    return saved || 'You are a helpful, brilliant AI assistant.';
  });

  // Temp states for modals forms
  const [tempProfile, setTempProfile] = useState(userProfile);
  const [tempSystemPrompt, setTempSystemPrompt] = useState(systemPrompt);

  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Derived state: what is currently on the screen
  const currentChat = chatSessions.find((chat) => chat.id === currentChatId);
  const messages = currentChat ? currentChat.messages : [];

  // Persist to local storage whenever chatSessions changes
  useEffect(() => {
    localStorage.setItem('aihub-chats', JSON.stringify(chatSessions));
  }, [chatSessions]);

  useEffect(() => {
    localStorage.setItem('aihub-profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('aihub-system-prompt', systemPrompt);
  }, [systemPrompt]);

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

  const clearAllChats = () => {
    if (window.confirm("Are you sure you want to delete all chats? This cannot be undone.")) {
      setChatSessions([]);
      setCurrentChatId(null);
      setIsSettingsOpen(false);
    }
  };

  const saveProfile = () => {
    setUserProfile(tempProfile);
    setIsProfileOpen(false);
  };

  const saveSettings = () => {
    setSystemPrompt(tempSystemPrompt);
    setIsSettingsOpen(false);
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

      // Inject system prompt for the backend
      const fullPrompt = `System Instructions: ${systemPrompt}\n\nUser: ${prompt}`;

      const response = await axios.post(apiUrl, { prompt: fullPrompt });
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
        userProfile={userProfile}
        openProfile={() => {
          setTempProfile(userProfile);
          setIsProfileOpen(true);
        }}
        openSettings={() => {
          setTempSystemPrompt(systemPrompt);
          setIsSettingsOpen(true);
        }}
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

      {/* Profile Modal */}
      <Modal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        title="Edit Profile"
      >
        <div className="modal-field">
          <label>Display Name</label>
          <input
            type="text"
            className="modal-input"
            value={tempProfile.name}
            onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
            maxLength={20}
          />
        </div>
        <div className="modal-field">
          <label>Choose Avatar</label>
          <div className="avatar-selector">
            {['🐱', '🐶', '🦊', '🐼', '🤖', '👽', '👻', '😎'].map((emoji) => (
              <div
                key={emoji}
                className={`avatar-option ${tempProfile.avatar === emoji ? 'selected' : ''}`}
                onClick={() => setTempProfile({ ...tempProfile, avatar: emoji })}
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>
        <button className="modal-btn" onClick={saveProfile}>Save Profile</button>
      </Modal>

      {/* Settings Modal */}
      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="Settings"
      >
        <div className="modal-field">
          <label>System Prompt (AI Behavior)</label>
          <textarea
            className="modal-input modal-textarea"
            value={tempSystemPrompt}
            onChange={(e) => setTempSystemPrompt(e.target.value)}
            placeholder="You are a helpful assistant..."
          />
        </div>
        <button className="modal-btn" onClick={saveSettings}>Save Settings</button>

        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <div className="modal-field">
            <label style={{ color: '#ff4d4d' }}>Danger Zone</label>
            <button className="modal-btn modal-btn-danger" onClick={clearAllChats}>
              Clear All Chats
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;
