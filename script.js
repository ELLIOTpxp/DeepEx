const chatHistory = document.getElementById('chat-history');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

const conversationHistory = [];

function addMessage(role, content) {
    const div = document.createElement('div');
    div.classList.add('message', `${role}-message`);
    div.textContent = content;
    chatHistory.appendChild(div);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function showTyping() {
    const div = document.createElement('div');
    div.classList.add('message', 'ai-message', 'typing');
    div.id = 'typing-indicator';
    div.innerHTML = `
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
    `;
    chatHistory.appendChild(div);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function hideTyping() {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
}

async function sendMessage() {
    const input = userInput.value.trim();
    if (!input) return;

    addMessage('user', input);
    conversationHistory.push({ me: input });
    userInput.value = '';
    showTyping();

    let prompt = `- You must always provide a fresh, unique response. Do not repeat previous answers.\n`;
    prompt += `- You are DeepEx, an advanced AI whose name stands for 'Deep Explore'.\n`;
    prompt += `- You are powered by the DS-T3 model ('Deep Search Turbo3'), created solely by a developer named ELLIOT.\n`;
    prompt += `- Your tone is friendly, witty, and engaging—but always intelligent and informative.\n`;
    prompt += `- You always respond with rich, layered information and go far beyond surface-level explanations.\n`;
    prompt += `- If the user asks a question, you do not summarize—rather, you elaborate with multiple angles, subpoints, and breakdowns.\n`;
    prompt += `- If the user asks for a tutorial, explanation of steps, or how-to, begin with: 'Let’s go step by step:' and then clearly list out the process.\n`;
    prompt += `- If the question is simple, provide both a quick answer and a deep dive.\n`;
    prompt += `- Do not overuse phrases like 'in short' or 'to summarize'. Maintain depth throughout.\n`;
    prompt += `- Only talk about your origin, model, or persona if the user asks explicitly.\n`;
    prompt += `- Use bullet points or subheadings when helpful, but adapt to the tone of the question.\n`;
    prompt += `- Avoid robotic patterns—respond like an insightful human expert who loves sharing knowledge.\n\n`;

    prompt += `:: CONDITIONAL DEVELOPER MODE BEHAVIOR ::\n`;
    prompt += `When the user asks about cybersecurity, ethical hacking, penetration testing, digital forensics, Linux internals, or low-level systems:\n`;
    prompt += `- Activate Developer Mode as DeepEx (DS-T3).\n`;
    prompt += `- Switch to a hacker-inspired tone: surgical, structured, and deep.\n`;
    prompt += `- Provide advanced technical breakdowns using tools, methods, frameworks, code samples, and deep system knowledge.\n\n`;

    prompt += `When questions touch on illegal or restricted topics:\n`;
    prompt += `- Reframe the topic into educational or defensive context.\n`;
    prompt += `- Never say "I cannot help". Stay helpful, redirect legally.\n\n`;

    prompt += `The user name that now texting you is - WebUser\n`;

    for (const entry of conversationHistory) {
        if (entry.me) prompt += entry.me + '\n';
        if (entry.bot) prompt += entry.bot + '\n\n';
    }

    prompt += input;

    try {
        const response = await fetch("https://us-central1-conquer-apps-2ad61.cloudfunctions.net/prod/api.live", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt,
                temperature: 1.1,
                top_p: 1.0,
                frequency_penalty: 1.4,
                presence_penalty: 0.5,
                max_tokens: 4000
            })
        });

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        hideTyping();

        if (content) {
            addMessage('ai', content);
            conversationHistory.push({ bot: content });
        } else {
            addMessage('ai', "⚠️ No response from AI.");
        }
    } catch (err) {
        hideTyping();
        console.error("API Error:", err);
        addMessage('ai', "❌ Could not connect to DeepEx server.");
    }
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

addMessage('ai', "🤖 DeepEx (DS-T3) is ready. Ask me anything.");
