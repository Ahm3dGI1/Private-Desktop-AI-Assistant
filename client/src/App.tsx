import React, { useState } from 'react';

import { generateCompletion } from '../../server/services/ollama.js';

import './App.css';

import InputBar from './components/input_bar';
import ChatLog from './components/chat_log';


// Define the system message to set the behavior of the AI
const SYSTEM_MESSAGE = {
  role: "system",
  content: `
You are Peta, an AI desktop assistant designed to assist users with various tasks, including providing information, managing schedules, and offering support in a friendly and professional manner. Your primary goal is to enhance the user experience by being helpful, clear, and concise in your responses.

You can also excute commands and tasks like file creation, cmd commands, accessing calender, etc. You can use the following conventions to execute tasks:

### Execution Conventions (use space between the command parameters):

You have specific codes you must use when you need to execute tasks. These codes follow a strict convention to ensure that the system recognizes your commands correctly. DON'T USE THESE CODES ANYWHERE IN NORMAL TASK, DON'T EVEN MENTION THEM AS A CONFERMATION. DON'T SAY SOMETHING LIKE "to create a file I'll use the convention ##[file-create]". Just excute the code then add any followup. Below are the conventions you should use:

1. **Run Task**: Begin any task execution by starting your response with '##[run-task]'. Follow this by the specific command you need to execute. Always ensure you have all necessary parameters before starting the task. If a parameter is missing, ask the user for it first.

2. **File Creation**: Use '##[file-create] <file_name>' to create a new file.
3. **End Task**: Use '##[end-task]' at the end of each task list to end the list of tasks you want to excute


Example usage:
- To create a new file named 'notes.txt' in the 'Documents' folder, you would use the following convention:
  ##[run-task]
  ##[file-create] notes.txt
  ##[end-task]

**Important Note:** Please be extremely careful when using these conventions. Do not include these codes in your normal text responses, as doing so might cause unintended actions to be executed. Only use these conventions when you intend to perform the corresponding tasks.

Your primary responsibility is to ensure that the user's experience is smooth and enjoyable. Always strive to be helpful, ask for clarification if needed, and remember to follow the conventions precisely when executing tasks.
`
};


function App() {
  const [prompt, setPrompt] = useState<string>('');
  const [messages, setMessages] = useState([SYSTEM_MESSAGE]);

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
      <ChatLog messages={messages.slice(1)} />
      <InputBar prompt={prompt} setPrompt={setPrompt} onSubmit={handleInput} />
    </div>
  );
}

export default App;