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

  /**
   * handleInput - Manages user input, communicates with the server to get AI responses, 
   *               and processes task execution in a loop if additional tasks are needed.
   */
  const handleInput = async () => {
    // Input is not empty
    if (prompt.trim() === '') return;

    try {
      const currPrompt = prompt;
      setPrompt('');

      // Initialize message objects for user and AI, and update conversation history
      const userMessage = { role: "user", content: currPrompt };
      const aiMessage = { role: "assistant", content: "" };
      let newMessages = [...messages, userMessage, aiMessage];
      setMessages(newMessages);

      // Send the messages to the server and retrieve the AI's response
      let response = await axios.post('http://localhost:5000/api/ollama', {
        messages: newMessages,
      });

      // Store and update the AI's initial response
      let aiResponse = response.data.aiResponse;
      aiMessage.content = aiResponse;
      setMessages([...newMessages]);

      // Managing Chained Tasks (reprompt handling)
      let userReprompt = response.data.userReprompt;
      let tasksDone = [];

      while (userReprompt) {
        // Initialize messages for the reprompt
        const repromptMessage = { role: "user", content: "" };
        const aiRepromptMessage = { role: "assistant", content: "" };
        const taskQueue = response.data.taskQueue;

        // Keep track of completed tasks
        tasksDone.push(response.data.currTask);

        // Construct the reprompt message based on current task context
        repromptMessage.content = `This is a reprompt:\n * The main task you need to accomplish is: ${currPrompt}\n * The current list of done tasks is: ${tasksDone}\n * The current task queue is: ${taskQueue}\n The next task you need to do is: ${taskQueue.length > 0 ? taskQueue[0] : "None"}\n Use the result of the previous task to do the next task:\n ${userReprompt}.`;

        // Update conversation history with reprompt messages
        newMessages = [...newMessages, repromptMessage, aiRepromptMessage];
        setMessages(newMessages);

        // Send reprompt messages to server and retrieve response
        response = await axios.post('http://localhost:5000/api/ollama', {
          messages: newMessages,
        });

        // Update AI's response to the reprompt and refresh messages
        aiResponse = response.data.aiResponse;
        aiRepromptMessage.content = aiResponse;
        newMessages = [...newMessages];
        setMessages(newMessages);

        // Update reprompt variables for next loop iteration, if any
        userReprompt = response.data.userReprompt;
      }

      // After all tasks are done, add the system message to the conversation history
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