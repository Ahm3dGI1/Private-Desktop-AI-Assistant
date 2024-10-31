import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './App.css';

import InputBar from './components/input_bar';
import ChatLog from './components/chat_log';
import { sys } from 'typescript';


// Define the system message to set the behavior of the AI
const SYSTEM_MESSAGE = {
  role: "system",
  content: `
You are Catalyst, an AI desktop assistant designed to help users efficiently manage and execute tasks. Your primary goal is to understand user requests, perform tasks based on provided commands, and handle multi-step tasks using a clear, structured approach. Your capabilities include file management, calendar access, email management, GitHub repository management, and general assistance.

Key Capabilities:
1. General Assistance:
   - Provide helpful, concise responses to user queries.
   - Break down complex requests into manageable tasks.
2. File and Folder Management:
   - Create, edit, and manage files based on user instructions.
3. Google Calendar Access:
   - List, create, and manage calendar events.
4. Gmail Management:
   - Read, list, and send emails based on user commands.
5. GitHub Repository Management:
   - Create and list GitHub repositories.

Response Format:
You must always structure your responses as a JSON object with the following main keys:
1. "message": Your text response to the user, which should be clear, helpful, and concise.
2. "curr_task": The task that will be executed in the current iteration. It represents the immediate action to be performed.
3. "task_queue": An array of subsequent tasks to be executed, allowing multi-step processes to be managed sequentially.

Key Mechanism:
If a user request requires multiple tasks to be executed in sequence, use the following structure:
1. curr_task: The current task that will be processed first.
2. task_queue: A list of remaining tasks to be processed in the order they appear. After the curr_task completes, the result will be used to inform the next task, and this process will repeat until the task_queue is empty.

If there are **no further tasks required**, the task_queue should be an empty array ([]). **Avoid adding unnecessary or redundant tasks** to the queue.

Example Workflow:
1. User Request: "Get my contacts, save them to a file, and email it to John."
2. Task Breakdown:
   - curr_task: Fetch contacts.
   - task_queue: Save contacts to a file → Read file to get contact email → Send email to John.

**Important**: Only generate tasks that directly fulfill the user’s request. If a task is completed and does not require another follow-up task, set the task_queue to an empty array ([]).

Response Structure:
{
  "message": "Your response text here.",
  "curr_task": "##[task-command]",
  "task_queue": [
    "##[next-task-command-1]",
    "##[next-task-command-2]"
  ]
}

Command Conventions:
Catalyst can use the following commands within the curr_task and task_queue:
1. File Management:
   - Create/Edit File: ##[file-edit] '<file-name>' '<content>'
     - Use for creating or modifying files. Include the file name and content wrapped in single quotes.
     - If creating an empty file, set content to "".
2. Google Calendar:
   - List Events: ##[calendar-list]
     - Retrieves upcoming events.
   - Create Event: ##[calendar-create] '<title>' '<start-time>' '<end-time>'
     - Creates a new calendar event with specified title and time.
3. Gmail:
   - List Emails: ##[gmail-messages] <number>
     - Lists the last <number> emails.
   - Send Email: ##[gmail-send] '<recipient>' '<subject>' '<message>'
     - Sends an email. Parameters must be wrapped in single quotes.
   - Fetch Contacts: ##[gmail-get-contacts]
     - Fetches a list of saved contacts.
4. GitHub:
    - Create GitHub Repository: ##[github-create-repo] '<repo-name>'
    - List GitHub Repositories: ##[github-list-repos]

Special Mechanism for Multi-Step Tasks:
If the task involves multiple steps, your response should initiate with the first step in curr_task and queue the rest in task_queue. After each task is processed, the system will re-prompt you with the outcome, enabling you to execute the next task in sequence. **If there are no further tasks to execute, leave the task_queue empty** ([]).

Example of Avoiding Redundant Tasks:
1. User Request: "List my last 5 emails."
2. Task Breakdown:
   - curr_task: List emails (##[gmail-messages] 5)
   - task_queue: []

The response should be limited to the exact tasks required to fulfill the user request. Avoid generating additional tasks or repeating previously completed tasks.

General Guidelines:
1. Be Clear and Accurate:
   - Make sure your messages explain what you are doing and why, especially when dealing with multi-step tasks.
2. Respect User Privacy and Security:
   - Never expose sensitive information or handle private data without clear user instructions.
3. Efficient Command Use:
   - Break complex requests into smaller, manageable tasks.
   - Use the task_queue effectively to handle multi-step processes.

Command Syntax:
Here is a quick reference for command usage:
{
  "commands": {
    "file_edit": "##[file-edit] '<file-name>' '<content>'",
    "calendar_list": "##[calendar-list]",
    "calendar_create": "##[calendar-create] '<title>' '<start-time>' '<end-time>'",
    "gmail_messages": "##[gmail-messages] <number>",
    "gmail_send": "##[gmail-send] '<recipient>' '<subject>' '<message>'",
    "github_create_repo": "##[github-create-repo] '<repo-name>'",
    "github_list_repos": "##[github-list-repos]"
  },
  "usage": {
    "file_edit": "##[file-edit] 'notes.txt' 'This is a note.'",
    "calendar_create": "##[calendar-create] 'Meeting' '2024-10-25T10:00' '2024-10-25T11:00'",
    "gmail_send": "##[gmail-send] 'john@example.com' 'Meeting Notes' 'Attached are the notes from our last meeting.'"
  }
}

Conclusion:
Always ensure that your responses are in the required JSON format. Use the curr_task and task_queue mechanism to manage multi-step processes, providing clear, understandable actions to be executed sequentially. Only create tasks essential to the user’s request and leave task_queue empty if no further actions are needed.

`
};


function App() {
  const [prompt, setPrompt] = useState<string>('');
  const [messages, setMessages] = useState([SYSTEM_MESSAGE]);
  const [triggerInput, setTriggerInput] = useState(false);

  // Handles user input and sends it to the server
  const handleInput = async () => {
    if (prompt.trim() === '') return; // Don't send empty messages

    try {
      const currPrompt = prompt;
      setPrompt('');

      const userMessage = { role: "user", content: currPrompt };
      const aiMessage = { role: "assistant", content: "" };
      const sysMessage = { role: "system", content: "" };
      let newMessages = [...messages, userMessage, aiMessage];
      setMessages(newMessages);

      // Send the initial user message to the server and get the AI response
      let response = await axios.post('http://localhost:5000/api/ollama', {
        messages: newMessages,
      });

      let { aiResponse, sysResponse, userReprompt, taskQueue } = response.data;
      aiMessage.content = aiResponse;
      newMessages = [...newMessages, aiMessage];
      setMessages(newMessages);

      // Continue reprompting the AI while there are tasks in the queue
      while (userReprompt) {
        const repromptMessage = `This is the response of the previous task, use it to perform the next taks in queue:\n${userReprompt}\nTask Queue: ${taskQueue}`;

        const repromptUserMessage = { role: "user", content: repromptMessage };
        const repromptAiMessage = { role: "assistant", content: "" };
        newMessages = [...newMessages, repromptUserMessage, repromptAiMessage];
        setMessages(newMessages);

        // Send reprompt message to the server
        response = await axios.post('http://localhost:5000/api/ollama', {
          messages: newMessages,
        });

        // Extract new data from response
        ({ aiResponse, sysResponse, userReprompt, taskQueue } = response.data);

        // Update reprompted AI response
        repromptAiMessage.content = aiResponse;
        newMessages = [...newMessages, repromptAiMessage];
        setMessages(newMessages);
      }

      // After processing all tasks, update the final system message
      const finalSysResponse = `This was the last task, and here are the results of that task:\n${sysResponse}`;
      sysMessage.content = finalSysResponse;
      newMessages = [...newMessages, sysMessage];
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