async function sendMessage() {
    const input = document.getElementById('messageInput');
    const messages = document.getElementById('messages');
    const sessionId = document.getElementById('sessionId').textContent;
    
    const message = input.value.trim();
    if (!message) return;
    
    // User message
    messages.innerHTML += `<div class="message user">${message}</div>`;
    input.value = '';
    
    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, sessionId })
        });
        const data = await response.json();
        
        // Update session ID
        document.getElementById('sessionId').textContent = data.sessionId;
        
        // Bot response
        messages.innerHTML += `<div class="message bot">${data.reply}</div>`;
        messages.scrollTop = messages.scrollHeight;
    } catch (error) {
        messages.innerHTML += `<div class="message bot">Error: ${error.message}</div>`;
    }
}

document.getElementById('messageInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
