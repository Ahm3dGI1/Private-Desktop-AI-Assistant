import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './App.css';

import InputBar from './components/input_bar';
import ChatLog from './components/chat_log';

import { AI_MODEL_TEMPLATE, AI_MODEL_TEMPLATE_CHAINED_CONTINUOUS } from './constraints/template';


// For sequential function calling, repromt the AI with the whole message chain while highlighting The global Task, The task Queue, and the last task response.

// Define the system message to set the behavior of the AI
const SYSTEM_TEMPLATE = {
  role: "system",
  content: AI_MODEL_TEMPLATE_CHAINED_CONTINUOUS // AI_MODEL_TEMPLATE or AI_MODEL_TEMPLATE_CHAINED_CONTINUOUS
};


function App() {
  const [prompt, setPrompt] = useState<string>('');
  const [messages, setMessages] = useState([SYSTEM_TEMPLATE]);
  const [triggerInput, setTriggerInput] = useState(false);

  /**
   * handleInput - Manages user input, communicates with the server to get AI responses, 
   *               and processes task execution in a loop if additional tasks are needed.
   */
  const handleInput = async () => {
    if (prompt.trim() === '') return; // Don't send empty messages

    try {
      const currPrompt = prompt;
      setPrompt('');

      const userMessage = { role: "user", content: currPrompt };
      const aiMessage = { role: "assistant", content: "" };
      const newMessages = [...messages, userMessage, aiMessage];
      setMessages(newMessages);

      // Send the messages to the server and get the AI response
      const response = await axios.post('http://localhost:5000/api/ollama', {
        messages: newMessages,
      });

      const aiResponse = response.data.aiResponse;

      aiMessage.content = aiResponse;

      setMessages([...newMessages]);

      console.log(messages);

    } catch (error) {
      console.error('Error:', error);
    }
  };


  // Calls the Python speech-to-text service
  const callPythonStt = async () => {
    try {
      const response = await axios.post('http://localhost:4001/listen');
      const newPrompt = response.data.text;

      setPrompt(newPrompt);
      setTriggerInput(true);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Trigger input handling when speech-to-text completes
  useEffect(() => {
    if (triggerInput) {
      handleInput();
      setTriggerInput(false);
    }
  }, [triggerInput]);

  return (
    <div className="App">
      <ChatLog messages={messages.slice(1)} />
      <InputBar prompt={prompt} setPrompt={setPrompt} onSubmit={setTriggerInput} takeVoice={callPythonStt} />
    </div>
  );
}

export default App;