import React, { useState } from 'react';

import { generateCompletion } from './services/ollama.js';

import './App.css';

import InputBar from './components/input_bar';
import ChatLog from './components/chat_log';

function App() {
  const [prompt, setPrompt] = useState<string>('');
  const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);

  const handleInput = async () => {
    if (prompt.trim() === '') return; // Don't send empty messages

    try {
      const currPrompt = prompt;
      setPrompt('');

      const userMessage = { role: "user", content: currPrompt };
      const aiMessage = { role: "assistant", content: "" };
      const newMessages = [...messages, userMessage, aiMessage];
      setMessages(newMessages);

      await generateCompletion(newMessages.slice(0, -1), (updateMessage: string) => {
        aiMessage.content += updateMessage;
        setMessages(prevMessages => [...prevMessages]); // Trigger re-render with updated messages
      });

    } catch (error) {
      console.error('Error:', error); // Log any errors
    }
  };

  return (
    <div className="App">
      <ChatLog messages={messages} />
      <InputBar prompt={prompt} setPrompt={setPrompt} onSubmit={handleInput} />
    </div>
  );
}

export default App;