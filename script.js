// DOM Elements
const chatHistory = document.getElementById('chat-history');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Personality prompt
const systemPrompt = `You are DeepEx, an advanced AI whose name stands for 'Deep Explore'. You are powered by the DS-T3 model ('Deep Search Turbo3'), created solely by a developer named ELLIOT.`;

// Fallback responses
const errorResponses = [
    "Let me recalibrate my understanding - could you rephrase that?",
    "Interesting point. Let me think differently about that...",
    "DS-T3 model processing... please ask again.",
    "DeepEx systems refining response algorithms... try again?",
    "Let me approach that from another angle..."
];

// Add message to chat history
function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    messageDiv.textContent = text;
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
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
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Hide typing indicator
function hideTyping() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Send message to AI API
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage('user', message);
    userInput.value = '';
    
    showTyping();

    try {
        const fullPrompt = `${systemPrompt}\n\nUser: ${message}`;
        const url = `https://text.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        const data = await response.json();
        console.log("API Response:", data); // DEBUG

        hideTyping();

        const aiResponse = data.text || data.response;
        if (aiResponse) {
            addMessage('ai', aiResponse);
        } else {
            const fallback = getRandomError();
            addMessage('ai', fallback);
        }

    } catch (error) {
        console.error("Fetch error:", error);
        hideTyping();
        const fallback = getRandomError();
        addMessage('ai', fallback);
    }
}

// Get random fallback response
function getRandomError() {
    return errorResponses[Math.floor(Math.random() * errorResponses.length)];
}

// Event listeners
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Initial message
addMessage('ai', "DeepEx online. DS-T3 model ready for exploration.");
