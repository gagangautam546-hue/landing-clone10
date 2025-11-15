/*
Minimal Express server to accept POST /api/send-sms and forward to Twilio.
This file intentionally does not include credentials — use environment variables.

Usage (after installing deps):
  setx TWILIO_ACCOUNT_SID "your_sid"
  setx TWILIO_AUTH_TOKEN "your_token"
  setx TWILIO_PHONE_NUMBER "+1234567890"
  node server.js

This server also serves static files from the current directory so you can open
http://localhost:3000/index.html and test the client-side form.
*/

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
// serve static site files from repo root
app.use(express.static(path.join(__dirname)));

// health
app.get('/health', (req, res) => res.json({ ok: true }));

// POST /api/send-sms
app.post('/api/send-sms', async (req, res) => {
  const { to, message } = req.body || {};
  if(!to || !message) return res.status(400).json({ ok:false, error: 'missing to or message' });

  // require credentials in environment
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;
  if(!sid || !token || !from) return res.status(500).json({ ok:false, error: 'Twilio not configured on server' });

  try{
    const twilio = require('twilio')(sid, token);
    const msg = await twilio.messages.create({ body: message, from, to });
    return res.json({ ok:true, sid: msg.sid });
  }catch(err){
    console.error('Twilio send error', err && err.message);
    return res.status(500).json({ ok:false, error: err && err.message });
  }
});

app.listen(PORT, ()=> console.log(`Server listening on http://localhost:${PORT}`));
