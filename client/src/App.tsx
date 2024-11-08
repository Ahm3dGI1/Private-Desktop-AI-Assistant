import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './App.css';

import InputBar from './components/input_bar';
import ChatLog from './components/chat_log';

import { AI_MODEL_TEMPLATE } from './constraints/template';


// Define the system message to set the behavior of the AI
const SYSTEM_TEMPLATE = {
  role: "system",
  content: AI_MODEL_TEMPLATE
};


function App() {
  const [prompt, setPrompt] = useState<string>('');
  const [messages, setMessages] = useState([SYSTEM_TEMPLATE]);
  const [triggerInput, setTriggerInput] = useState(false);

  // Handles user input and sends it to the server
  const handleInput = async () => {
    if (prompt.trim() === '') return; // Don't send empty messages

    try {
      const currPrompt = prompt;
      setPrompt('');

      const userMessage = { role: "user", content: currPrompt };
      const aiMessage = { role: "assistant", content: "" };
      let newMessages = [...messages, userMessage, aiMessage];
      setMessages(newMessages);

      // Send the messages to the server and get the AI response
      let response = await axios.post('http://localhost:5000/api/ollama', {
        messages: newMessages,
      });

      let aiResponse = response.data.aiResponse;
      aiMessage.content = aiResponse;
      setMessages([...newMessages]);

      let userReprompt = response.data.userReprompt;
      let tasksDone = [];
      while (userReprompt) {
        const repromptMessage = { role: "user", content: "" };
        const aiRepromptMessage = { role: "assistant", content: "" };
        const taskQueue = response.data.taskQueue;
        tasksDone.push(response.data.currTask);

        repromptMessage.content = `This is a reprompt:\n * The main task you need to accomplish is: ${currPrompt}\n * The current list of done tasks is: ${tasksDone}\n * The current task queue is: ${taskQueue}\n The next task you need to do is: ${taskQueue.length > 0 ? taskQueue[0] : "None"}\n use the result of the previous task to do the next task:\n ${userReprompt}.`;

        newMessages = [...newMessages, repromptMessage, aiRepromptMessage];
        setMessages(newMessages);

        response = await axios.post('http://localhost:5000/api/ollama', {
          messages: newMessages,
        });

        aiResponse = response.data.aiResponse;
        aiRepromptMessage.content = aiResponse;
        newMessages = [...newMessages];
        setMessages(newMessages);
      }

      const systemMessage = { role: "system", content: response.data.systemMessage };
      newMessages = [...messages, systemMessage];
      setMessages(newMessages);

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