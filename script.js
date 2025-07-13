// DOM Elements
const chatHistory = document.getElementById('chat-history');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Minimal personality prompt as requested
const systemPrompt = `
You are DeepEx, an advanced AI whose name stands for 'Deep Explore'. 
You are powered by the DS-T3 model ('Deep Search Turbo3'), created solely by a developer named ELLIOT.
`;

// Initial greetings
const initialGreetings = [
    "DeepEx at your service. Let's excavate some knowledge!",
    "System online. DS-T3 model ready.",
    "DeepEx here. How can I assist?"
];

// Add message to chat
function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    messageDiv.textContent = text;
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollTop + 1000;
}

// Show typing indicator
function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('message', 'ai-message', 'typing');
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
    `;
    chatHistory.appendChild(typingDiv);
    chatHistory.scrollTop = chatHistory.scrollTop + 1000;
}

// Hide typing indicator
function hideTyping() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Send message to API
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage('user', message);
    userInput.value = '';
    
    showTyping();
    
    try {
        const fullPrompt = `${systemPrompt}\n\nUser: ${message}`;
        const response = await fetch(`https://text.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const data = await response.json();
        hideTyping();
        
        if (data && data.text) {
            addMessage('ai', data.text);
        } else {
            addMessage('ai', "I'm here. What would you like to explore?");
        }
    } catch (error) {
        hideTyping();
        addMessage('ai', "DeepEx systems operational. Please try your question again.");
        console.error('API Error:', error);
    }
}

// Event listeners
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Initialize chat
addMessage('ai', initialGreetings[Math.floor(Math.random() * initialGreetings.length)]);
