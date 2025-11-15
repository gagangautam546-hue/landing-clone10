Rebelvids SMS helper (local)

This small helper demonstrates how to send the "Schedule a Call" form details by SMS using Twilio.

Files added:
- server.js       - minimal Express server exposing POST /api/send-sms
- package.json    - dependencies and start script
- .env.example    - template for environment variables (do NOT commit real creds)

Quick start (Windows PowerShell):
1. Install Node.js (if not already installed).
2. Open PowerShell in this project folder.
3. Install deps:
   npm install
4. Set environment variables (PowerShell example):
   $env:TWILIO_ACCOUNT_SID = "your_sid"
   $env:TWILIO_AUTH_TOKEN = "your_token"
   $env:TWILIO_PHONE_NUMBER = "+1234567890"
5. Start server:
   npm start
6. Open http://localhost:3000/index.html in your browser and submit the schedule form.

Notes:
- The server serves static files from the project directory so your existing index.html will be available.
- Keep your Twilio credentials secret. For production, use a secure secrets manager.
- If you want, I can add an ngrok example to expose the server for remote testing.
