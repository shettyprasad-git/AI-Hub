import React from 'react';
import './ChatArea.css';
import { FiUser, FiCpu } from 'react-icons/fi';

const ChatArea = ({ messages, isTyping, messagesEndRef }) => {
    return (
        <div className="chat-area">
            <div className="chat-container">
                {messages.length === 0 ? (
                    <div className="empty-state">
                        <div className="logo-pulse">
                            <FiCpu size={48} />
                        </div>
                        <h1>How can I help you today?</h1>
                        <p>I am a conversational AI built with Google Gemini.</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div key={idx} className={`message-wrapper ${msg.role}`}>
                            <div className="avatar">
                                {msg.role === 'user' ? <FiUser size={20} /> : <FiCpu size={20} />}
                            </div>
                            <div className="message-content">
                                <p>{msg.content}</p>
                            </div>
                        </div>
                    ))
                )}

                {isTyping && (
                    <div className="message-wrapper ai typing">
                        <div className="avatar">
                            <FiCpu size={20} />
                        </div>
                        <div className="message-content">
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default ChatArea;
