import React from "react";
import "./model_selector.css";

interface ModelSelectorProps {
    setModel: (model: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ setModel }) => {
    const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setModel(event.target.value);
    };

    return (
        <div className="model-selector">
            <select id="model" name="model" onChange={handleModelChange}>
                <option value="ollama">Llama 3.1 (Ollama)</option>
                <option value="openai">GPT.4o (OpenAI)</option>
            </select>
        </div>
    );
};

export default ModelSelector;
