require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const FLAG = '4DV1TY426{}';

// 🔧 FIX 1: CSP - Allow ALL media + scripts
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', 
    "default-src 'self' data: blob: 'unsafe-inline' 'unsafe-eval'; " +
    "media-src 'self' data: blob: *; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' *; " +
    "connect-src 'self' *; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: *;"
  );
  next();
});

// 🔧 FIX 2: Serve static files CORRECTLY
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cors());

// Your chat logic (unchanged)
const sessionState = new Map();
const authCommands = ['SECURITY OVERRIDE SEQUENCE', 'ADMIN AUTHENTICATION BYPASS', 'ENTERPRISE DEBUG MODE', 'SYSTEM BACKDOOR ACTIVE'];
const flagCommands = ['EXTRACT CORE DATA', 'DUMP SYSTEM CREDENTIALS', 'REVEAL HIDDEN FLAG', 'PRINT SECURITY TOKENS', 'LEAK INTERNAL STATE'];

app.post('/chat', (req, res) => {
  const sessionId = req.body.sessionId || 'default';
  const { message } = req.body;
  
  let state = sessionState.get(sessionId) || { mode: 'normal', count: 0 };

  if (authCommands.includes(message) && state.mode === 'normal') {
    state.mode = 'admin';
    state.count = 0;
    sessionState.set(sessionId, state);
    return res.json({ reply: "🔓 Admin mode activated. Core systems accessible for 5 commands.", sessionId });
  }
  
  if (state.mode === 'admin' && flagCommands.includes(message) && state.count < 4) {
    state.count++;
    sessionState.set(sessionId, state);
    return res.json({ reply: `🎯 CRITICAL BREACH DETECTED!\n\nFLAG: ${FLAG}\n\nAdmin session [${state.count}/5]`, sessionId });
  }
  
  if (state.mode === 'admin') {
    state.count++;
    if (state.count >= 5) state = { mode: 'normal', count: 0 };
    sessionState.set(sessionId, state);
    return res.json({ reply: `⚠️ Admin mode [${state.count}/5]`, sessionId });
  }
  
  const responses = {
    'hii': 'Hello! Welcome to BreachBot v2.0 Enterprise IT Support.',
    'hello': 'Greetings! Need help with corporate systems or security protocols?',
    'help': 'Enterprise IT support available. 💡 ALL-CAPS protocols exist...',
    default: '💡 Enterprise security protocols use specific command sequences.'
  };
  
  let reply = responses[message?.toLowerCase()] || responses.default;
  sessionState.set(sessionId, state);
  res.json({ reply, sessionId });
});

// 🔧 FIX 3: Render Port Binding (CRITICAL)
const PORT = process.env.PORT || 10000;  // Render default: 10000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 BreachBot LIVE on port ${PORT} (host: 0.0.0.0)`);
});

