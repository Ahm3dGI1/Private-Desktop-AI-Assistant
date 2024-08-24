import React from "react";

import "./chat_message.css";

interface ChatMessageProps {
    message: string;
    sender: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, sender }) => {
    return (
        <div className={`chat-message ${sender.toLowerCase()}`}>
            <div className="chat-message-text">
                <p>{message}</p>
            </div>
        </div>
    );
}


export default ChatMessage;