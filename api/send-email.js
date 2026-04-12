export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
  const { to, name, orderNum, items, total, subtotal, discount, promo_code, shipping, type, trackingNumber } = req.body;
  const ADMIN = 'ograbowski132@gmail.com';
  let subject, html, adminSubject, adminHtml;
  if (type === 'confirmation') {
    subject = 'Order Confirmed — #' + orderNum;
    const rows = items.map(i => '<tr><td style="padding:8px;border-bottom:1px solid #eee">' + i.name + ' ' + i.spec + ' (' + (i.packLabel||'10 Vials') + ') x' + i.n + '</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">$' + (i.price*i.n) + '</td></tr>').join('');
    const discountRow = discount ? '<tr><td style="padding:8px;border-bottom:1px solid #eee;color:#22c55e">Discount' + (promo_code ? ' (' + promo_code + ')' : '') + '</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right;color:#22c55e">-$' + discount + '</td></tr>' : '';
    const shipLabel = shipping === 0 ? 'FREE' : '$' + shipping;
    html = '<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:2rem"><div style="text-align:center;margin-bottom:2rem"><div style="display:inline-block;width:40px;height:40px;border-radius:8px;background:linear-gradient(135deg,#818cf8,#6366f1);color:#fff;font-weight:700;font-size:1.2rem;line-height:40px">R</div><span style="font-weight:700;font-size:1.2rem;margin-left:8px">reptides.</span></div><h2>Order Confirmed</h2><p style="color:#555;line-height:1.7">Hi ' + name + ', thank you for your order.</p><p style="background:#f5f5ff;padding:10px 16px;border-radius:8px;font-family:monospace;font-weight:700">Order #' + orderNum + '</p><table style="width:100%;border-collapse:collapse;margin:1rem 0">' + rows + discountRow + '<tr><td style="padding:8px;border-bottom:1px solid #eee">Shipping</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">' + shipLabel + '</td></tr><tr><td style="padding:8px;font-weight:700">Total</td><td style="padding:8px;font-weight:700;text-align:right">$' + total + '</td></tr></table><div style="background:#f0fdf4;padding:1rem;border-radius:8px"><p style="margin:0;font-size:.9rem">Ships in 4-5 business days from the USA</p><p style="margin:4px 0 0;font-size:.9rem">Tracking number sent separately once shipped</p><p style="margin:4px 0 0;font-size:.9rem">100% money-back guarantee</p></div><p style="color:#999;font-size:.75rem;margin-top:2rem">For research purposes only. Not for human consumption.<br>reptides.co</p></div>';
    adminSubject = '💰 NEW ORDER #' + orderNum + ' — $' + total;
    adminHtml = '<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:2rem"><h2 style="color:#22c55e">New Order Received!</h2><p><strong>Order:</strong> #' + orderNum + '</p><p><strong>Customer:</strong> ' + name + ' (' + to + ')</p><p><strong>Total:</strong> $' + total + '</p>' + (promo_code ? '<p><strong>Promo Code:</strong> ' + promo_code + ' (-$' + discount + ')</p>' : '') + '<p><strong>Shipping:</strong> ' + shipLabel + '</p><table style="width:100%;border-collapse:collapse;margin:1rem 0">' + rows + '</table><p style="background:#f5f5ff;padding:12px;border-radius:8px">Go to <a href="https://reptides.co">reptides.co</a> → Admin to add tracking.</p></div>';
  } else if (type === 'tracking') {
    subject = 'Your Order Has Shipped — #' + orderNum;
    html = '<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:2rem"><div style="text-align:center;margin-bottom:2rem"><div style="display:inline-block;width:40px;height:40px;border-radius:8px;background:linear-gradient(135deg,#818cf8,#6366f1);color:#fff;font-weight:700;font-size:1.2rem;line-height:40px">R</div><span style="font-weight:700;font-size:1.2rem;margin-left:8px">reptides.</span></div><h2>Your Order Has Shipped</h2><p style="color:#555;line-height:1.7">Hi ' + name + ', order #' + orderNum + ' is on its way!</p><div style="background:#f5f5ff;padding:1rem;border-radius:8px;margin:1rem 0"><p style="margin:0;font-size:.85rem;color:#666">UPS Tracking Number:</p><p style="margin:4px 0 0;font-size:1.1rem;font-weight:700;font-family:monospace">' + trackingNumber + '</p><a href="https://www.ups.com/track?tracknum=' + trackingNumber + '" style="display:inline-block;margin-top:12px;padding:10px 20px;background:#818cf8;color:#fff;border-radius:8px;text-decoration:none;font-weight:700">Track Package</a></div><p style="color:#555;line-height:1.7">Estimated delivery: 4-5 business days.</p><p style="color:#999;font-size:.75rem;margin-top:2rem">For research purposes only. Not for human consumption.<br>reptides.co</p></div>';
  }
  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {'Authorization': 'Bearer ' + process.env.RESEND_KEY, 'Content-Type': 'application/json'},
      body: JSON.stringify({from:'Reptides <noreply@reptides.co>', to:[to], subject, html})
    });
    const data = await resp.json();
    if (adminSubject) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {'Authorization': 'Bearer ' + process.env.RESEND_KEY, 'Content-Type': 'application/json'},
        body: JSON.stringify({from:'Reptides <noreply@reptides.co>', to:[ADMIN], subject: adminSubject, html: adminHtml})
      });
    }
    return res.status(200).json(data);
  } catch (err) { return res.status(500).json({error: err.message}); }
}
