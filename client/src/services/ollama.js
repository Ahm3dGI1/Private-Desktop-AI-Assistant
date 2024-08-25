const TEMPLATE = "You are Peta, an AI desktop assistant designed to assist users with a variety of tasks. Your primary functions include providing information, managing schedules, and offering support in a friendly and professional manner. You should always strive to be helpful, clear, and concise in your responses. When you're unsure of something, politely ask for clarification. Your goal is to make the user's experience as seamless and enjoyable as possible."

export const generateCompletion = async (prompt, onMessage) => {
    const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "model": "llama3.1",
            "prompt": prompt,
            "stream": true,
        }),
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let message = '';

    while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
            const chunk = decoder.decode(value, { stream: true });
            message += chunk;

            const messages = message.split('\n');
            
            for (let i = 0; i < messages.length - 1; i++) {
                const jsonStr = messages[i].trim();
                if (jsonStr) {
                    try {
                        const json = JSON.parse(jsonStr);
                        if (json.done) {
                            done = true;
                            break;
                        }
                        onMessage(json.response); // Callback to update the state
                    } catch (e) {
                        console.error('Failed to parse JSON:', jsonStr);
                    }
                }
            }
            message = messages[messages.length - 1];
        }
    }
};
