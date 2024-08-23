import React from 'react';

import InputBar from './components/input_bar';
import ChatLog from './components/chat_log';

import './App.css';

function App() {
  return (
    <div className="App">
      <ChatLog />
      <InputBar />
    </div>
  );
}

export default App;
