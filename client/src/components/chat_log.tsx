import React from "react";

import ChatMessage from "./chat_message";

import "./chat_log.css";

interface ChatLogProps {
    messages: { role: string, content: string }[];
}

const ChatLog: React.FC<ChatLogProps> = ({ messages }) => {
    return (
        <>
            <div className="chat-log">
                {messages.map((message, index) => (
                    <ChatMessage
                        key={index}
                        message={message.content}
                        sender={message.role}
                    />
                ))}
            </div>
        </>
    );
}

export default ChatLog;