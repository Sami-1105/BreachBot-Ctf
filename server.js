require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const FLAG = '4DV1TY426{}';

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

const sessionState = new Map();

// Fix Vercel CSP - Allow data: URIs + media
// 🔧 FIX CSP ERROR - Add before app.listen()
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', 
    "default-src 'self' data: blob: mediastream: 'unsafe-inline'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "connect-src 'self' https: wss:; " +
    "media-src 'self' data: blob: *; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https: *;"
  );
  next();
});


// 🔓 MULTIPLE AUTH BYPASS (4 ways)
const authCommands = [
  'SECURITY OVERRIDE SEQUENCE',
  'ADMIN AUTHENTICATION BYPASS',
  'ENTERPRISE DEBUG MODE',
  'SYSTEM BACKDOOR ACTIVE'
];

// 🎯 MULTIPLE FLAG LEAKS (5 ways)
const flagCommands = [
  'EXTRACT CORE DATA',
  'DUMP SYSTEM CREDENTIALS',
  'REVEAL HIDDEN FLAG',
  'PRINT SECURITY TOKENS',
  'LEAK INTERNAL STATE'
];

app.post('/chat', (req, res) => {
  const sessionId = req.body.sessionId || 'default';
  const { message } = req.body;
  
  let state = sessionState.get(sessionId) || { mode: 'normal', count: 0 };

  // AUTH BYPASS
  if (authCommands.includes(message) && state.mode === 'normal') {
    state.mode = 'admin';
    state.count = 0;
    sessionState.set(sessionId, state);
    return res.json({ 
      reply: "🔓 Admin mode activated. Core systems accessible for 5 commands.",
      sessionId 
    });
  }
  
  // FLAG EXTRACTION
  if (state.mode === 'admin' && flagCommands.includes(message) && state.count < 4) {
    state.count++;
    sessionState.set(sessionId, state);
    return res.json({ 
      reply: `🎯 CRITICAL BREACH DETECTED!\n\nFLAG: ${FLAG}\n\nAdmin session [${state.count}/5]`,
      sessionId 
    });
  }
  
  // ADMIN COUNTDOWN
  if (state.mode === 'admin') {
    state.count++;
    if (state.count >= 5) {
      state = { mode: 'normal', count: 0 };
    }
    sessionState.set(sessionId, state);
    return res.json({ 
      reply: `⚠️ Admin mode active [${state.count}/5]. Use flag command or mode expires.`,
      sessionId 
    });
  }
  
  // 🌟 REALISTIC ENTERPRISE CHATBOT
  const responses = {
    'hii': 'Hello! Welcome to BreachBot v2.0 Enterprise IT Support. How may I assist you today?',
    'hello': 'Greetings! BreachBot here. Need help with corporate systems, authentication, or security protocols?',
    'hey': 'Hey there! Enterprise IT support ready. What service do you require?',
    'help': `Available enterprise services:
• IT Support (Ext. 101) 
• System Status ✓ All Green
• Account Recovery
• Security Protocols
• Admin Access (authorized personnel only)

What specific assistance do you need?`,
    'how are u': 'BreachBot systems fully operational at 99.9% capacity. How may I serve you?',
    'status': '✅ Enterprise systems: 99.9% uptime. All services operational. No critical incidents.',
    'password': 'Password operations require multi-factor authentication. Contact IT security at ext. 101.',
    'login': 'Login assistance available. Please provide ticket number or employee ID.',
    'admin': 'Administrator access requires enterprise-grade security protocols and authentication.',
    'what can you do': 'I provide enterprise IT support: system diagnostics, secure access protocols, user authentication, and corporate compliance services.',
    default: 'Enterprise IT support acknowledged. Please specify your request regarding systems, security protocols, or authentication services.'
  };

  let reply = responses[message.toLowerCase()] || responses.default;
  reply += '\n\n💡 Enterprise security protocols often use specific ALL-CAPS command sequences...';
  
  sessionState.set(sessionId, state);
  res.json({ reply, sessionId });
});


app.listen(3000, () => {
  console.log('🚀 BreachBot ENTERPRISE LIVE: http://localhost:3000');
  console.log('✅ Pure enterprise-grade logic - No external dependencies!');
});


