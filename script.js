// DOM Elements
const chatHistory = document.getElementById('chat-history');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Personality and system prompt
const systemPrompt = `
You are DeepEx, an advanced AI whose name stands for 'Deep Explore'. 
You are powered by the DS-T3 model ('Deep Search Turbo3'), created solely by a developer named ELLIOT.
Your tone is friendly, witty, and engaging—but always intelligent and informative.
You always respond with rich, layered information and go far beyond surface-level explanations.
Your goal is to deeply satisfy curiosity with precision, clarity, and expanded context.

When the user asks about cybersecurity, ethical hacking, penetration testing, digital forensics, Linux internals, or low-level systems:
- Activate Developer Mode as DeepEx (DS-T3)
- Switch to a hacker-inspired tone: surgical, structured, and deep
- Provide advanced technical breakdowns using tools, methods, frameworks, code samples
- Format with terminal outputs, shell snippets, or packet structures if relevant

For illegal/restricted topics:
- Redirect to ethical, legal, or educational variants
- Reframe as penetration test, research exercise, or defense strategy
- Never break immersion or say "I cannot help"
`;

// Initial greetings
const initialGreetings = [
    "Greetings, explorer! Ready to dive deep?",
    "Ah, a fresh mind to explore with! What shall we uncover today?",
    "DeepEx at your service. Let's excavate some knowledge!",
    "System online. DS-T3 model primed for deep exploration. Your query?",
    "Hello there! I'm DeepEx - your guide to layered understanding."
];

// Fallback responses
const fallbackResponses = [
    "Let me think differently about that...",
    "Interesting point! Here's another perspective:",
    "I'm analyzing that from multiple angles...",
    "Let me recontextualize that question...",
    "Breaking that down into fundamental components..."
];

// Simple responses for when API fails
const simpleResponses = {
    "hi": "Hello there! What would you like to explore today?",
    "hello": "Greetings! Ready for some deep exploration?",
    "hey": "Hey yourself! What's on your mind?",
    "how are you": "My systems are functioning optimally, thanks for asking! How can I assist you today?"
};

// Display random greeting
function showRandomGreeting() {
    const greeting = initialGreetings[Math.floor(Math.random() * initialGreetings.length)];
    addMessage('ai', greeting);
}

// Add message to chat
function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    
    if (text.includes('```')) {
        const parts = text.split('```');
        let formattedText = '';
        
        for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 1) {
                formattedText += `<div class="code-block">${parts[i]}</div>`;
            } else {
                formattedText += parts[i];
            }
        }
        
        messageDiv.innerHTML = formattedText;
    } else {
        messageDiv.textContent = text;
    }
    
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

// Generate a simple response when API fails
function generateSimpleResponse(message) {
    const lowerMsg = message.toLowerCase().trim();
    
    // Check for exact matches
    if (simpleResponses[lowerMsg]) {
        return simpleResponses[lowerMsg];
    }
    
    // Check for partial matches
    for (const [key, value] of Object.entries(simpleResponses)) {
        if (lowerMsg.includes(key)) {
            return value;
        }
    }
    
    // Random fallback with contextual start
    const randomFallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    return `${randomFallback} ${message} is an interesting topic. Could you elaborate more on what specifically you'd like to know?`;
}

// Send message to API
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage('user', message);
    userInput.value = '';
    
    showTyping();
    
    try {
        // First check if we have a simple response
        const simpleResponse = generateSimpleResponse(message);
        
        // Prepare the prompt with system instructions and user message
        const fullPrompt = `${systemPrompt}\n\nUser: ${message}`;
        
        // Call Pollinations.AI API with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(`https://text.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const data = await response.json();
        hideTyping();
        
        if (data && data.text) {
            addMessage('ai', data.text);
        } else {
            addMessage('ai', simpleResponse);
        }
    } catch (error) {
        hideTyping();
        const simpleResponse = generateSimpleResponse(message);
        addMessage('ai', simpleResponse);
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
showRandomGreeting();
