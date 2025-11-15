const functions = require('firebase-functions');
const cors = require('cors');
const axios = require('axios');
const Razorpay = require('razorpay');

// CORS allowed origins (adjust if needed)
const allowedOrigins = [
  'https://rebelvids-academy.web.app',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
];

const corsHandler = cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
});

exports.createPaymentLink = functions
  .region('asia-south1')
  .https.onRequest(async (req, res) => {
    return corsHandler(req, res, async () => {
      if (req.method === 'OPTIONS') return res.status(204).send('');
      if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

      try {
        const { title, amount, currency = 'INR', redirectUrl, customer } = req.body || {};
        if (!title || !amount || !redirectUrl) {
          return res.status(400).json({ error: 'Missing required fields: title, amount, redirectUrl' });
        }
        const amt = Math.round(Number(amount) * 100);
        if (!Number.isFinite(amt) || amt <= 0) {
          return res.status(400).json({ error: 'Invalid amount' });
        }

        // Prefer Firebase Functions config vars; fallback to env vars
        const cfg = (functions && functions.config && functions.config().razorpay) || {};
        const keyId = cfg.key_id || process.env.RZP_KEY_ID;
        const keySecret = cfg.key_secret || process.env.RZP_KEY_SECRET;
        if (!keyId || !keySecret) {
          return res.status(500).json({ error: 'Razorpay keys not configured' });
        }

        const payload = {
          amount: amt,
          currency,
          description: title,
          callback_url: redirectUrl,
          callback_method: 'get',
          notes: { title },
        };
        if (customer && (customer.name || customer.email || customer.contact)) {
          payload.customer = customer; // {name, email, contact}
        }

        const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
        const data = await rzp.paymentLink.create(payload);
        return res.status(200).json({
          id: data.id,
          short_url: data.short_url,
          status: data.status,
        });
      } catch (e) {
        const msg = e?.response?.data || e?.message || 'Unknown error';
        return res.status(500).json({ error: msg });
      }
    });
  });
