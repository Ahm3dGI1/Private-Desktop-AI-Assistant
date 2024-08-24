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
      const userMessage = { text: prompt, sender: "User" };
      const data = await generateCompletion(prompt);
      const aiMessage = { text: data.choices[0].text, sender: "AI" };

      setMessages(prevMessages => [...prevMessages, userMessage, aiMessage]);
      setPrompt(''); // Clear input field
    } catch (error) {
      console.error('Error:', error);
    }
  }



  return (
    <div className="App">
      <ChatLog messages={messages} />
      <InputBar prompt={prompt} setPrompt={setPrompt} onSubmit={handleInput} />
    </div>
  );
}

export default App;
