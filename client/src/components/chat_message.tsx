import React from "react";
import Markdown from "react-markdown";

import "./chat_message.css";

interface ChatMessageProps {
    message: string;
    sender: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, sender }) => {
    return (
        <div className={`chat-message ${sender.toLowerCase()}`}>
            <div className="chat-message-text">
                <Markdown>{message}</Markdown> {/* Render message as Markdown */}
            </div>
        </div>
    );
}

export default ChatMessage;