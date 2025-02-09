import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './App.css';

import InputBar from './components/input_bar';
import ChatLog from './components/chat_log';
import SideBar from './components/side_bar';

import { AI_MODEL_TEMPLATE } from './constraints/template';


// Define the system message to set the behavior of the AI
const SYSTEM_TEMPLATE = {
  role: "system",
  content: AI_MODEL_TEMPLATE // AI_MODEL_TEMPLATE
};


function App() {
  const [prompt, setPrompt] = useState<string>('');
  const [messages, setMessages] = useState([SYSTEM_TEMPLATE]);
  const [currConversationId, setCurrConversationId] = useState<string>('');
  const [triggerInput, setTriggerInput] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>("ollama");


  /**
   * handleInput - Manages user input, communicates with the server to get AI responses, 
   *               and processes task execution in a loop if additional tasks are needed.
   */
  const handleInput = async () => {
    if (prompt.trim() === '') return; // Don't send empty messages

    try {
      let conversationId = currConversationId;

      // If there is no conversation ID, create a new one
      if (conversationId === '') {
        const response = await axios.post('http://localhost:5000/api/conversations/new',
          { messages: [SYSTEM_TEMPLATE] }
        );
        conversationId = response.data.conversationId;
        setCurrConversationId(conversationId);
      }

      const currPrompt = prompt;
      setPrompt('');

      const userMessage = { role: "user", content: currPrompt };
      const aiMessage = { role: "assistant", content: "" };
      let newMessages = [...messages, userMessage, aiMessage];
      setMessages(newMessages);

      // Send the messages to the server and get the AI response
      const response = await axios.post('http://localhost:5000/api/model', {
        messages: newMessages,
        model: selectedModel
      });

      const aiResponse = response.data.aiResponse;
      const systemResponse = response.data.systemResponse;

      aiMessage.content = aiResponse;

      if (systemResponse.trim()) {
        const systemMessage = { role: "system", content: systemResponse };
        newMessages = [...newMessages, systemMessage];
      }
      setMessages([...newMessages]);

      // Save the conversation to the database
      await axios.post(`http://localhost:5000/api/conversations/save`, {
        currConversationId: conversationId,
        messages: newMessages,
      });
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

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
  };

  useEffect(() => {
    if (currConversationId === '') return;
    const fetchConversations = async () => {
      const conversations = await axios.get(`http://localhost:5000/api/conversations/${currConversationId}`);
      setMessages(conversations.data.messages);
    };
    fetchConversations();
  }, [currConversationId]);



  return (
    <div className="App">
      <div className="main-container">
        <SideBar setModel={handleModelChange} setCurrConversationId={setCurrConversationId} />
        <div className="chat-container">
          <ChatLog messages={messages.slice(1)} />
          <InputBar prompt={prompt} setPrompt={setPrompt} onSubmit={setTriggerInput} takeVoice={callPythonStt} />
        </div>
      </div>
    </div>
  );
}

export default App;