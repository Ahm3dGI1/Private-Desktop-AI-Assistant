# Catalyst - AI Desktop Assistant

Catalyst is a dynamic AI-powered desktop assistant designed to help users with various tasks efficiently and intuitively. 
With its extensible architecture and the capability to execute complex workflows, Catalyst is more than just a personal assistant—it's a powerful tool for managing your digital life.

## ✨ Features

1. **General Assistance and Conversation**:
    - Engage in general conversations and receive contextual answers to your questions.
    - Supports Markdown and LaTeX for mathematical and scientific explanations.

2. **File and Folder Management**:
    - Create, edit, and manage files seamlessly.

3. **Google Calendar Integration**:
    - List and create calendar events effortlessly.

4. **Email Management**:
    - List and send Gmail messages, making communication a breeze.

5. **GitHub Repository Management**:
    - Create and list GitHub repositories directly from the assistant.

6. **News Retrieval**:
    - Fetch top news headlines based on queries or categories.

7. **Contacts Management**:
    - List contacts from your Google account for easy access.

---

## 🛠️ Demos

### Example 1: Python Code
The assistant can fetch your recent Gmail messages and save them to a file:

**Input**:
```
Can you create a python file with the code for a simple Tic Tac Toe game
```

**Result**:

![Screenshot 2024-12-29 003603](https://github.com/user-attachments/assets/990d348f-c84f-4d87-b174-ffa6a45779b5)

### Example 2: Fetching Emails and adding them to a file (Chained Tasks)
**Input**:
```
List my last 10 emails and add them to a file named emails.txt
```

**Result**:

![Screenshot 2024-12-29 003052](https://github.com/user-attachments/assets/4f73dc3c-d34e-4d85-be31-4fb2ae3e8a90)

---

## 🔧 How It Works

Catalyst combines cutting-edge AI models with carefully designed task parsers to perform complex operations. It achieves this through:

1. **Manual Function Calling**:
    - A unique approach where the AI outputs tasks as JSON commands, which are parsed and executed by the backend. This system allows precise control and transparency over task execution.

2. **Sequential Task Execution**:
    - The AI can chain tasks using the output of one as the input for the next, enabling complex workflows like fetching emails and saving them to a file.

3. **Custom Parsers**:
    - Each feature, from file handling to GitHub management, has a dedicated parser that interprets AI commands and executes them.

4. **Modular Design**:
    - The project is structured into independent modules for better maintainability and scalability.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** for backend and frontend
- **Python 3.x** for the text-to-speech service
- **Google API credentials** for Gmail, Calendar, and Contacts
- **GitHub token** for repository management
- **News API key** for fetching news headlines

### Installation

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/yourusername/catalyst.git
    cd catalyst
    ```

2. **Set Up Backend**:
    ```bash
    cd server
    npm install
    ```

3. **Set Up Frontend**:
    ```bash
    cd client
    npm install
    ```

4. **Set Up Python Microservice**:
    ```bash
    cd python_microservice
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    pip install -r requirements.txt
    ```

5. **Environment Variables**:
    Create a `.env` file in the root directories for `server` and `python_microservice`. Include keys like:
    ```env
    GOOGLE_API_CREDENTIALS_PATH=path/to/credentials.json
    GOOGLE_API_TOKEN_PATH= "path/to/token.json"
    GITHUB_TOKEN=your_github_token
    NEWS_API_KEY=your_news_api_key
    ```

---

## 🖥️ Running Catalyst

1. **Start the Python Microservice**:
    ```bash
    cd python_microservice
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    python app.py
    ```

2. **Start the Backend Server**:
    ```bash
    cd server
    npm start
    ```

3. **Start the Frontend Client**:
    ```bash
    cd client
    npm start
    ```

---

## 📚 Design Highlights

1. **Manual Function Calling**:
Catalyst's unique approach to task execution ensures precision and flexibility. The AI outputs tasks in a structured JSON format, which are interpreted by dedicated handlers.

2. **Chained Task Execution**:
Tasks can depend on the results of previous actions, allowing for workflows like fetching news and emailing them to a contact.

3. **Error Handling and Modular Parsers**:
Each feature is independently parsed, ensuring robust error handling and clear separation of concerns.

4. **Customizable AI Model**:
Powered by Ollama's API, the assistant can adapt to user-specific needs, with further potential for fine-tuning.

---

## 📅 Future Plans

- **Sequential Functions**:
Improve how the model deals with chained tasks (allow it to see the result of each task and, according to it, define the input for the next task)

- **Enhanced Voice Interaction**:
Improve the quality of Speach-To-Text and Text-To-Speach.

- **Electron Integration**:
Package Catalyst as a cross-platform desktop application.

- **More Models**:
Add support for other models like GPT3.5 and 4.

- **Extended API Support**:
Add support for more services like Dropbox, Slack, and Trello.

---

## 🤝 Contributing

Catalyst is a work in progress, and contributions are welcome! If you find a bug or have an idea for improvement, feel free to open an issue or submit a pull request.

---

## 📝 License

This project is licensed under the MIT License.
