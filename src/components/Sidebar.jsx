import React from 'react';
import { FiPlus, FiMessageSquare, FiSettings, FiUser } from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    return (
        <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
                <button className="new-chat-btn">
                    <FiPlus size={20} />
                    <span>New Chat</span>
                </button>
            </div>

            <div className="sidebar-content">
                <div className="history-group">
                    <p className="history-title">Recent</p>
                    <ul className="history-list">
                        <li className="history-item active">
                            <FiMessageSquare size={16} />
                            <span>React Context API Help</span>
                        </li>
                        <li className="history-item">
                            <FiMessageSquare size={16} />
                            <span>Fix Python Build Error</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="sidebar-footer">
                <button className="footer-btn">
                    <FiUser size={18} />
                    <span>Profile</span>
                </button>
                <button className="footer-btn">
                    <FiSettings size={18} />
                    <span>Settings</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
