import React, { useState } from 'react';

import { generateCompletion } from './services/ollama.js';

import './App.css';

import InputBar from './components/input_bar';
import ChatLog from './components/chat_log';

function App() {
  const [prompt, setPrompt] = useState<string>('');
  const [messages, setMessages] = useState<{ text: string, sender: string }[]>([]);


  const handleInput = async () => {
    if (prompt.trim() === '') return; // Don't send empty messages

    try {
      const currPrompt = prompt;
      setPrompt(''); // Clear input field
      const userMessage = { text: currPrompt, sender: "User" };
      setMessages(prevMessages => [...prevMessages, userMessage]);

      // Pass a callback to handle streaming messages
      const aiMessage = { text: "", sender: "AI" };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
      await generateCompletion(currPrompt, (newMessage: string) => {
        aiMessage.text += newMessage;
        setMessages(prevMessages => [...prevMessages]);
      });

    } catch (error) {
      console.error('Error:', error);
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