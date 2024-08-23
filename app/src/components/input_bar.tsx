import React from "react";

import "./input_bar.css";

import { FaCamera } from "react-icons/fa";
import { GrAttachment } from "react-icons/gr";

function InputBar() {
    return (
        <>
            <div className="in-container">
                <div className="in-text">
                    <input type="text" className="in-bar" placeholder="Type a message..." />
                    <div className="in-att">
                        <button className="in-file"><FaCamera /></button>
                        <button className="in-cam"><GrAttachment /></button>
                    </div>
                </div>
                <button className="in-voice"></button>
            </div>
        </>
    );
}

export default InputBar;