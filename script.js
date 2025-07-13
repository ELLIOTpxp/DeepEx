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

// Initial greeting
const initialGreetings = [
    "Greetings, explorer! Ready to dive deep?",
    "Ah, a fresh mind to explore with! What shall we uncover today?",
    "DeepEx at your service. Let's excavate some knowledge!",
    "System online. DS-T3 model primed for deep exploration. Your query?",
    "Hello there! I'm DeepEx - your guide to layered understanding."
];

// Display random greeting
function showRandomGreeting() {
    const greeting = initialGreetings[Math.floor(Math.random() * initialGreetings.length)];
    addMessage('ai', greeting);
}

// Add message to chat
function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    
    // Check if text contains code blocks or special formatting
    if (text.includes('```')) {
        const parts = text.split('```');
        let formattedText = '';
        
        for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 1) {
                // Code block
                formattedText += `<div class="code-block">${parts[i]}</div>`;
            } else {
                // Regular text
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

// Send message to API
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage('user', message);
    userInput.value = '';
    
    // Show typing indicator
    showTyping();
    
    try {
        // Prepare the prompt with system instructions and user message
        const fullPrompt = `${systemPrompt}\n\nUser: ${message}`;
        
        // Call Pollinations.AI API
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
        
        // Add AI response to chat
        if (data && data.text) {
            addMessage('ai', data.text);
        } else {
            addMessage('ai', "Hmm, I seem to have encountered a glitch. Could you try that again?");
        }
    } catch (error) {
        hideTyping();
        addMessage('ai', "My circuits are a bit overloaded at the moment. Could you rephrase or try again shortly?");
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