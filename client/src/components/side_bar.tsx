import React, { useState, useEffect } from 'react';
import axios from 'axios';

import ModelSelector from './model_selector';

import './side_bar.css';

interface SideBarProps {
    setModel: (model: string) => void;
    setCurrConversationId: (id: string) => void;
}

const SideBar: React.FC<SideBarProps> = ({ setModel, setCurrConversationId }) => {

    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        const fetchConversations = async () => {
            const response = await axios.get('http://localhost:5000/api/conversations');
            setConversations(response.data);
        };
        fetchConversations();
    }, []);

    return (
        <div className='side-bar'>
            <ModelSelector setModel={setModel} />
            <div className="conversations-container">
                <div>Conversations</div>
                <ul>
                    {Object.keys(conversations).map((convId) => (
                        <li key={convId} onClick={() => {
                            setCurrConversationId(convId);
                            console.log('Conversation ID:', convId);
                        }}>
                            {convId}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SideBar;
