export const generateCompletion = async (messages, updateMessage) => {
    console.log('Sending messages:', messages);

    const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        body: JSON.stringify({
            "model": "llama3.1",
            "messages": messages,
            "stream": true,
        }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let content = '';

    while (true){
        const { done, value } = await reader.read();

        if (done) {
            break;
        }

        const rawJson = decoder.decode(value);
        try {
            const json = JSON.parse(rawJson);
            if (json.done === false) {
                updateMessage(json.message.content);
            }
        } catch (e) {
            console.error('Failed to parse JSON:', rawJson);
        }
    }
};