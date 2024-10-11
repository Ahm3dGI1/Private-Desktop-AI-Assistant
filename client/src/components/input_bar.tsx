import React from "react";

import "./input_bar.css";

import { FaCamera } from "react-icons/fa";
import { GrAttachment } from "react-icons/gr";
import { FaMicrophone } from "react-icons/fa";

interface InputBarProps {
    prompt: string;
    setPrompt: (prompt: string) => void;
    onSubmit: () => void;
    takeVoice: () => void;
}

const InputBar: React.FC<InputBarProps> = ({ prompt, setPrompt, onSubmit, takeVoice }) => {

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSubmit();
        }
    };

    return (
        <>
            <div className="in-container">
                <div className="in-text">
                    <input
                        type="text"
                        className="in-bar"
                        placeholder="Type a message..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <div className="in-att">
                        <button className="in-file"><FaCamera /></button>
                        <button className="in-cam"><GrAttachment /></button>
                    </div>
                </div>
                <button
                    className="in-voice"
                    onClick={takeVoice}

                ><FaMicrophone /></button>
            </div>
        </>
    );
}

export default InputBar;