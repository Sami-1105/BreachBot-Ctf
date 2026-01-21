require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const FLAG = '4DV1TY426{}';

// 🛡️ PERFECT CSP - Allows ALL CTF resources
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; media-src 'self' data: blob:;"
  );
  next();
});


// 🔧 FIX 2: Serve static files CORRECTLY

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

/* 📁 Serve static files FROM ROOT */
app.use(express.static(__dirname));


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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

/* =========================
   🚀 Render Port Binding
   ========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server live on port ${PORT}`);
});
