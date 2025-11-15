const Razorpay = require('razorpay');

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.statusCode = 405;
      return res.end('Method Not Allowed');
    }

    const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'RAZORPAY_KEY_ID_PLACEHOLDER';
    const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'RAZORPAY_KEY_SECRET_PLACEHOLDER';

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { amount, currency = 'INR', notes = {}, title = 'Order' } = body;

    const amountNum = Number(amount);
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: 'Invalid amount' }));
    }

    const instance = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
    const order = await instance.orders.create({
      amount: Math.round(amountNum * 100),
      currency,
      receipt: 'rcpt_' + Date.now(),
      notes: {
        productId: notes.productId || '',
        downloadLink: notes.downloadLink || '',
        title: notes.title || title || ''
      }
    });

    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RAZORPAY_KEY_ID
    }));
  } catch (err) {
    console.error('create-order error', err);
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: 'Failed to create order' }));
  }
};
