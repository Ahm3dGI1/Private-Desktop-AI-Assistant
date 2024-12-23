import React, { useEffect, useRef } from "react";

import ChatMessage from "./chat_message";

import "./chat_log.css";

interface ChatLogProps {
    messages: { role: string, content: string }[];
}

const ChatLog: React.FC<ChatLogProps> = ({ messages }) => {

    const chatLogRef = useRef<HTMLDivElement | null>(null);

    // Automatically scroll to the bottom when messages change
    useEffect(() => {
        if (chatLogRef.current) {
            chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
        }
    }, [messages]);

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