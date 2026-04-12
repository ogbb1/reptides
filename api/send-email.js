export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
  const { to, name, orderNum, items, total, subtotal, discount, promo_code, shipping, type, trackingNumber } = req.body;
  const ADMIN = 'ograbowski132@gmail.com';
  const logo = '<div style="text-align:center;margin-bottom:1.5rem"><div style="display:inline-block;padding:16px 24px;border-radius:12px;background:#0b0d14"><span style="font-weight:700;font-size:1.4rem;color:#f0f1f5;letter-spacing:-0.5px">reptides</span><span style="font-weight:700;font-size:1.4rem;color:#818cf8">.</span></div></div>';
  const footer = '<div style="text-align:center;margin-top:2rem;padding-top:1.5rem;border-top:1px solid #1f2333"><p style="color:#6b7190;font-size:.75rem;margin:0">For research purposes only. Not for human consumption.</p><p style="color:#6b7190;font-size:.75rem;margin:4px 0 0"><a href="https://reptides.co" style="color:#818cf8;text-decoration:none">reptides.co</a></p></div>';
  let subject, html, adminSubject, adminHtml;
  if (type === 'confirmation') {
    subject = 'Order Confirmed — #' + orderNum;
    const rows = items.map(i => '<tr><td style="padding:10px 12px;border-bottom:1px solid #1f2333;color:#dfe2ea;font-size:.9rem">' + i.name + ' ' + i.spec + ' (' + (i.packLabel||'10 Vials') + ') x' + i.n + '</td><td style="padding:10px 12px;border-bottom:1px solid #1f2333;text-align:right;color:#f0f1f5;font-weight:600;font-family:monospace">$' + (i.price*i.n) + '</td></tr>').join('');
    const discountRow = discount ? '<tr><td style="padding:10px 12px;border-bottom:1px solid #1f2333;color:#2dd4bf;font-size:.9rem">Discount' + (promo_code ? ' (' + promo_code + ')' : '') + '</td><td style="padding:10px 12px;border-bottom:1px solid #1f2333;text-align:right;color:#2dd4bf;font-weight:600;font-family:monospace">-$' + discount + '</td></tr>' : '';
    const shipLabel = shipping === 0 ? 'FREE' : '$' + shipping;
    const shipColor = shipping === 0 ? '#2dd4bf' : '#dfe2ea';
    html = '<div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;max-width:560px;margin:0 auto;padding:2rem;background:#0b0d14;border-radius:16px">' + logo + '<div style="text-align:center;margin-bottom:1.5rem"><div style="display:inline-block;width:48px;height:48px;border-radius:50%;background:rgba(45,212,191,.12);line-height:48px;font-size:1.4rem">✓</div><h2 style="color:#f0f1f5;margin:12px 0 4px;font-size:1.3rem">Order Confirmed</h2><p style="color:#6b7190;font-size:.9rem;margin:0">Hi ' + name + ', thank you for your order.</p></div><div style="background:#12151e;border:1px solid #1f2333;border-radius:10px;padding:12px 16px;margin-bottom:1.5rem;text-align:center"><span style="font-family:monospace;font-weight:700;color:#818cf8;font-size:.95rem">Order #' + orderNum + '</span></div><table style="width:100%;border-collapse:collapse;margin:0 0 1.5rem">' + rows + discountRow + '<tr><td style="padding:10px 12px;border-bottom:1px solid #1f2333;color:#6b7190;font-size:.9rem">Shipping</td><td style="padding:10px 12px;border-bottom:1px solid #1f2333;text-align:right;color:' + shipColor + ';font-weight:600;font-family:monospace">' + shipLabel + '</td></tr><tr><td style="padding:12px;color:#f0f1f5;font-weight:700;font-size:1rem">Total</td><td style="padding:12px;text-align:right;color:#818cf8;font-weight:700;font-size:1.15rem;font-family:monospace">$' + total + '</td></tr></table><div style="background:#12151e;border:1px solid #1f2333;border-radius:10px;padding:14px 16px"><p style="margin:0;font-size:.85rem;color:#dfe2ea">📦 Ships in 4-5 business days from the USA</p><p style="margin:6px 0 0;font-size:.85rem;color:#dfe2ea">📧 Tracking number sent separately once shipped</p><p style="margin:6px 0 0;font-size:.85rem;color:#2dd4bf">✓ 100% money-back guarantee</p></div>' + footer + '</div>';
    adminSubject = '💰 NEW ORDER #' + orderNum + ' — $' + total;
    adminHtml = '<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:2rem"><h2 style="color:#22c55e">New Order Received!</h2><p><strong>Order:</strong> #' + orderNum + '</p><p><strong>Customer:</strong> ' + name + ' (' + to + ')</p><p><strong>Total:</strong> $' + total + '</p>' + (promo_code ? '<p><strong>Promo Code:</strong> ' + promo_code + ' (-$' + discount + ')</p>' : '') + '<p><strong>Shipping:</strong> ' + shipLabel + '</p><table style="width:100%;border-collapse:collapse;margin:1rem 0">' + rows + '</table><p style="background:#f5f5ff;padding:12px;border-radius:8px">Go to <a href="https://reptides.co">reptides.co</a> → Admin to add tracking.</p></div>';
  } else if (type === 'tracking') {
    subject = 'Your Order Has Shipped — #' + orderNum;
    html = '<div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;max-width:560px;margin:0 auto;padding:2rem;background:#0b0d14;border-radius:16px">' + logo + '<div style="text-align:center;margin-bottom:1.5rem"><div style="display:inline-block;width:48px;height:48px;border-radius:50%;background:rgba(129,140,248,.12);line-height:48px;font-size:1.4rem">📦</div><h2 style="color:#f0f1f5;margin:12px 0 4px;font-size:1.3rem">Your Order Has Shipped</h2><p style="color:#6b7190;font-size:.9rem;margin:0">Hi ' + name + ', order #' + orderNum + ' is on its way!</p></div><div style="background:#12151e;border:1px solid #1f2333;border-radius:10px;padding:20px;text-align:center;margin-bottom:1.5rem"><p style="margin:0;font-size:.75rem;color:#6b7190;text-transform:uppercase;letter-spacing:1px">Tracking Number</p><p style="margin:8px 0 16px;font-size:1.15rem;font-weight:700;font-family:monospace;color:#f0f1f5">' + trackingNumber + '</p><a href="https://www.ups.com/track?tracknum=' + trackingNumber + '" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#818cf8,#6366f1);color:#fff;border-radius:10px;text-decoration:none;font-weight:700;font-size:.9rem">Track Package →</a></div><div style="background:#12151e;border:1px solid #1f2333;border-radius:10px;padding:14px 16px"><p style="margin:0;font-size:.85rem;color:#dfe2ea">📅 Estimated delivery: 4-5 business days</p><p style="margin:6px 0 0;font-size:.85rem;color:#2dd4bf">✓ 100% money-back guarantee</p></div>' + footer + '</div>';
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
