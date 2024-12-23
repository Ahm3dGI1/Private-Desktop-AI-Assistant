# Private-Desktop-AI-Assistant
This project is a comprehensive AI assistant that can handle various tasks such as file creation and Google Calendar integration. The application combines a client-side React application, an Electron-based desktop application, and a server-side Node.js application. It uses an Ollama model as the AI powering the application and a JS parser to allow the AI to interact with the Operating System. The output of the AI is in the form of a JSON file that has the message and the tasks separated to avoid any miscalling for the tasks.

## Features

- **Speech Recognition**: Convert spoken language into text using advanced speech recognition models.
- **Text-to-Speech**: Convert text into spoken language using text-to-speech technology.
- **Email Management**: Read, list, and send emails using the Gmail API.
- **Calendar Management**: List and create events on Google Calendar.
- **News Fetching**: Fetch top news headlines based on user queries.
- **Contact Management**: List contacts from the user's Google account.
- **File Management**: Create and edit files within the application.
- **GitHub Integration**: List and create repositories on GitHub.

## Project Structure
The project is organized into three main directories: `client`, `electron`, and `server`.

### Client

* `client/`: his is a React application that serves as the front-end of the project. It includes various components, styles, and tests.

  * `src/`: Contains the source code for the React application, including components like `App.tsx` and components folder.

  * `src/App.tsx`: Main application component.

  * `components/`: Contains various React components like `chat_log.tsx` and `chat_message.tsx`.

  * `tsconfig.json`: TypeScript configuration for the React application.

The dependencies required for the React application are listed in the `client/package.json` file:
```json
{
  "dependencies": {
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "@types/jest": "^27.5.2",
    "@types/node": "^16.18.105",
    "@types/react": "^18.3.4",
    "@types/react-dom": "^18.3.0",
    "axios": "^1.7.7",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-icons": "^5.3.0",
    "react-markdown": "^9.0.1",
    "react-scripts": "5.0.1",
    "typescript": "^4.9.5",
    "web-vitals": "^2.1.4"
  }
}
```

### Electron

* `electron/`: Contains the Electron application.
  * `main.js`: Main entry point for the Electron application, responsible for creating the application window.
  * `preload.js`: Preloads scripts for the Electron application.
  * `package.json`: Manages dependencies and scripts for the Electron application.

Dependencies:
```json
{
  "dependencies": {
    "electron": "^25.3.1"
  },
  "devDependencies": {
    "electron-builder": "^24.6.0"
  }
}
```

### Server

* `server/`: Contains the Node.js server.
  * `app.js`: Main entry point for the server.
  * `package.json`: Manages dependencies and scripts for the server.
  * `services/`: Contains service-related logic, such as `ollama.js`.
  * `utils/`: Contains utility functions and handlers, including Google Calendar integration utilities and parsers for different commands.

Dependencies:

```json
{
  "dependencies": {
    "@google-cloud/local-auth": "^2.1.0",
    "axios": "^1.7.7",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.0",
    "fs": "^0.0.1-security",
    "googleapis": "^105.0.0",
    "newsapi": "^2.4.1",
    "path": "^0.12.7",
    "say": "^0.16.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.7"
  }
}
```

## Getting Started

### Prerequisites
* Node.js
* npm or yarn

### Installation

1. Clone the repository: git clone https://github.com/Ahm3dGI1/private-desktop-ai-assistant.git cd private-desktop-ai-assistant
2. Install dependencies for the client: cd ./client npm install
3. Install dependencies for the server: cd ./server npm install

### Running the Application
1. Start the server: 
    ```bash
    cd ./server npm start
    ```

2. Start the client:
    ```bash
    cd ./client npm start
    ```

3. Start the Python Microservices: 
    ```bash
    cd ./python_microservice
    ./venv/Scripts/activate
    python app.py
    ```

## License
This project is licensed under the MIT License.