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

// Long Test messages with markdown
const testMessages = [
  SYSTEM_TEMPLATE,
  { role: "user", content: "Hello! I want to know what's recursion" },
  {
    role: "assistant", content: `
# Advanced Markdown and LaTeX Demo

This is a comprehensive example of **Markdown** formatting combined with **LaTeX** equations. It includes various levels of complexity to ensure thorough testing of your renderer.

---

## **Introduction**

Markdown is a lightweight markup language that allows for formatting text, embedding links, and rendering rich content.LaTeX, on the other hand, is a typesetting system often used for writing mathematical and scientific documents. When combined, Markdown and LaTeX allow for creating structured and visually appealing documents.

---

## **Formatting Examples**

### **Basic Text Styles**
- **Bold**: \`**Bold**\` → **Bold**
- *Italic*: \`*Italic*\` → *Italic*
- ***Bold and Italic***: \`***Bold and Italic***\` → ***Bold and Italic***
- ~~Strikethrough~~: \`~~Strikethrough~~\` → ~~Strikethrough~~

> Blockquotes allow you to highlight important points.

---

## **Lists and Tables**

### **Ordered List**
1. First item
2. Second item
3. Third item

### **Unordered List**
- Item A
  - Sub-item A1
  - Sub-item A2
- Item B

### **Table Example**
| Syntax   | Description        |
|----------|--------------------|
| Header 1 | First column text  |
| Header 2 | Second column text |

---

## **Code Examples**

### **Inline Code**
You can use \`inline code\` for short snippets.

### **Block Code**
\`\`\`javascript
function add(a, b) {
    return a + b;
}
console.log(add(5, 10)); // Output: 15
\`\`\`

---

## **Mathematical Examples**

### **Inline Math**
Euler's identity is expressed as $e^{i\\pi} + 1 = 0$.

### **Block Math**
Here’s the quadratic formula:
$$
x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$

---

### **Advanced Equations**

#### **Integral Example**
The definite integral of a function:
$$
\\int_a^b f(x) dx = F(b) - F(a)
$$

#### **Probability Distribution**
The probability density function (PDF) of a normal distribution:
$$
f(x) = \\frac{1}{\\sqrt{2\\pi\\sigma^2}} e^{-\\frac{(x - \\mu)^2}{2\\sigma^2}}
$$

#### **System of Linear Equations**
A simple system of equations:
$$
\\begin{aligned}
3x + 2y &= 6 \\\\
7x - 4y &= 10
\\end{aligned}
$$

#### **Matrix Multiplication**
The product of two matrices:
$$
\\mathbf{C} = \\mathbf{A} \\cdot \\mathbf{B}
$$
Where:
$$
\\mathbf{A} =
\\begin{bmatrix}
1 & 2 \\\\
3 & 4
\\end{bmatrix},
\\quad
\\mathbf{B} =
\\begin{bmatrix}
5 & 6 \\\\
7 & 8
\\end{bmatrix},
\\quad
\\mathbf{C} =
\\begin{bmatrix}
19 & 22 \\\\
43 & 50
\\end{bmatrix}.
$$

#### **Fourier Transform**
The Fourier Transform of a function:
$$
\\mathcal{F}(f)(\\xi) = \\int_{-\\infty}^\\infty f(x) e^{-2\\pi i \\xi x} dx
$$

---

## **Physics Examples**

### **Newton's Second Law**
$$
F = ma
$$
Where:
- \\(F\\) is the force applied.
- \\(m\\) is the mass of the object.
- \\(a\\) is the acceleration.

### **Einstein's Energy Equation**
$$
E = mc^2
$$
Where:
- \\(E\\) is the energy.
- \\(m\\) is the mass.
- \\(c\\) is the speed of light.

### **Schrödinger Equation**
The time-dependent Schrödinger equation:
$$
i\\hbar \\frac{\\partial}{\\partial t} \\Psi(\\mathbf{r}, t) = \\hat{H} \\Psi(\\mathbf{r}, t)
$$

---

## **Complex Examples**

### **Taylor Series Expansion**
The Taylor series expansion of \\(e^x\\) is given by:
$$
e^x = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\dots + \\frac{x^n}{n!} + \\dots
$$

### **Navier-Stokes Equation**
The Navier-Stokes equation for fluid dynamics:
$$
\\rho \\left( \\frac{\\partial \\mathbf{v}}{\\partial t} + (\\mathbf{v} \\cdot \\nabla) \\mathbf{v} \\right) = -\\nabla p + \\mu \\nabla^2 \\mathbf{v} + \\mathbf{f}
$$

---

## **References**
- [Markdown Guide](https://www.markdownguide.org)
- [LaTeX Documentation](https://www.latex-project.org)
- [Physics Formulas](https://www.physicsclassroom.com)
    `
  },
];


function App() {
  const [prompt, setPrompt] = useState<string>('');
  const [messages, setMessages] = useState(testMessages);
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