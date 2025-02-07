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
        axios.get('http://localhost:5000/api/conversations')
            .then((response) => {
                const responseConversations = response.data.conversations;
                if (responseConversations) {
                    setConversations(responseConversations);
                }
            })
            .catch((error) => {
                console.error('Error fetching conversations:', error);
            });
    }, []);



    return (
        <div className='side-bar'>
            <ModelSelector setModel={setModel} />
            <div className="conversations-container">
                <h2>Conversations</h2>
                <ul>
                    {Object.keys(conversations).map((convId) => (
                        <li key={convId} onClick={() => setCurrConversationId(convId)}>
                            {convId}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SideBar;
