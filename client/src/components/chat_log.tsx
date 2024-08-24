import React from "react";

import ChatMessage from "./chat_message";

import "./chat_log.css";

interface ChatLogProps {
    messages: { text: string, sender: string }[];
}

const ChatLog: React.FC<ChatLogProps> = ({ messages }) => {
    return (
        <>
            <div className="chat-log">
                {messages.map((message, index) => (
                    <ChatMessage
                        key={index}
                        message={message.text}
                        sender={message.sender}
                    />
                ))}
            </div>
        </>
    );
}

export default ChatLog;