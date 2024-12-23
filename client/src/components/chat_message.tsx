import React from "react";
import MarkdownRender from "./markdown_renderer";

import "./chat_message.css";

interface ChatMessageProps {
    message: string;
    sender: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, sender }) => {
    return (
        <div className={`chat-message ${sender.toLowerCase()}`}>
            <div className="chat-message-text">
                <MarkdownRender content={message} />
            </div>
        </div>
    );
}

export default ChatMessage;
