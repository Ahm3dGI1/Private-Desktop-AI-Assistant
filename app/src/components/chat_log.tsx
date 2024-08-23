import React from "react";

import ChatMessage from "./chat_message";

import "./chat_log.css";

function ChatLog() {
    return (
        <>
            <div className="chat-log">
                <ChatMessage />
            </div>
        </>
    );
}

export default ChatLog;