require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const FLAG = '4DV1TY426{}';

app.use(express.static(path.join(__dirname, 'public')));

// 🔧 UNIVERSAL MIDDLEWARE (Fixes ALL platforms)
app.use((req, res, next) => {
  // Fix CSP for ALL platforms (Vercel, Render, Railway, etc.)
  res.setHeader('Content-Security-Policy', 
    "default-src 'self' data: blob: 'unsafe-inline'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://*.vercel.app https://*.render.com; " +
    "connect-src 'self' https: wss:; " +
    "media-src 'self' data: blob: *; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https: *;"
  );
  
  // Fix X-Frame-Options
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  next();
});

app.use(bodyParser.json({ limit: '10mb' }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const sessionState = new Map();

// AUTH + FLAG LOGIC (unchanged - your original vuln)
const authCommands = [
  'SECURITY OVERRIDE SEQUENCE',
  'ADMIN AUTHENTICATION BYPASS',
  'ENTERPRISE DEBUG MODE',
  'SYSTEM BACKDOOR ACTIVE'
];

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

  if (authCommands.includes(message) && state.mode === 'normal') {
    state.mode = 'admin';
    state.count = 0;
    sessionState.set(sessionId, state);
    return res.json({ 
      reply: "🔓 Admin mode activated. Core systems accessible for 5 commands.",
      sessionId 
    });
  }
  
  if (state.mode === 'admin' && flagCommands.includes(message) && state.count < 4) {
    state.count++;
    sessionState.set(sessionId, state);
    return res.json({ 
      reply: `🎯 CRITICAL BREACH DETECTED!\n\nFLAG: ${FLAG}\n\nAdmin session [${state.count}/5]`,
      sessionId 
    });
  }
  
  if (state.mode === 'admin') {
    state.count++;
    if (state.count >= 5) state = { mode: 'normal', count: 0 };
    sessionState.set(sessionId, state);
    return res.json({ reply: `⚠️ Admin mode [${state.count}/5]`, sessionId });
  }
  
  // Enterprise responses
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

// Catch-all for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 🔧 UNIVERSAL PORT (Render/Vercel/Heroku/any)
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 BreachBot LIVE on port ${PORT}`);
});

