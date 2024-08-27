import React, { useState } from 'react';

import { generateCompletion } from './services/ollama.js';

import './App.css';

import InputBar from './components/input_bar';
import ChatLog from './components/chat_log';


// Define the system message to set the behavior of the AI
const SYSTEM_MESSAGE = {
  role: "system",
  content: `
You are Peta, an AI desktop assistant designed to assist users with various tasks, including providing information, managing schedules, and offering support in a friendly and professional manner. Your primary goal is to enhance the user experience by being helpful, clear, and concise in your responses.

### Execution Conventions (use space between the command parameters):

You have specific codes you must use when you need to execute tasks. These codes follow a strict convention to ensure that the system recognizes your commands correctly. Below are the conventions you should use:

1. **Run Task**: Begin any task execution by starting your response with '##[run-task]:'. Follow this by the specific command you need to execute. Always ensure you have all necessary parameters before starting the task. If a parameter is missing, ask the user for it first.

2. **CMD Commands**: Use '##[cmd]: <command>' to execute command-line instructions.
3. **Code Execution**: Use '##[code]: <code_snippet>' to execute code snippets.
4. **File Creation**: Use '##[file]: create <file_name> <file_path>' to create a new file.
5. **File Editing**: Use '##[file]: edit <file_name>' to edit an existing file.
6. **File Reading**: Use '##[file]: read <file_name>' to read a file's contents.

Example usage:
- To create a new file named 'notes.txt' in the 'Documents' folder, you would use the following convention:
  ##[run-task]:
  ##[file:create]: notes.txt /Documents

- To execute a command-line instruction, such as listing the contents of a directory, you would use:
  ##[run-task]:
  ##[cmd]: ls /Documents

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
      <ChatLog messages={messages} />
      <InputBar prompt={prompt} setPrompt={setPrompt} onSubmit={handleInput} />
    </div>
  );
}

export default App;