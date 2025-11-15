const crypto = require('crypto');
const Razorpay = require('razorpay');

function json(res, code, obj){ res.statusCode = code; res.setHeader('Content-Type','application/json'); res.end(JSON.stringify(obj)); }

module.exports = async (req, res) => {
  try{
    if(req.method !== 'POST') return json(res, 405, { error: 'Method Not Allowed' });

    const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'RAZORPAY_KEY_ID_PLACEHOLDER';
    const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'RAZORPAY_KEY_SECRET_PLACEHOLDER';

    const body = typeof req.body === 'string' ? JSON.parse(req.body||'{}') : (req.body||{});
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature){
      return json(res, 400, { error: 'Missing fields' });
    }

    const shasum = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET);
    shasum.update(razorpay_order_id + '|' + razorpay_payment_id);
    const expectedSignature = shasum.digest('hex');
    const valid = expectedSignature === razorpay_signature;
    if(!valid) return json(res, 400, { ok:false, error: 'Invalid signature' });

    const instance = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
    let redirectUrl = '';
    try{
      const order = await instance.orders.fetch(razorpay_order_id);
      if(order && order.notes && order.notes.downloadLink) redirectUrl = order.notes.downloadLink;
    }catch(_){}

    return json(res, 200, { ok:true, redirectUrl });
  }catch(err){
    console.error('verify-payment error', err);
    return json(res, 500, { ok:false, error:'Verification failed' });
  }
};
