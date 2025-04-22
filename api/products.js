// api/products.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  // 1. Detect calling site from Origin header
  const origin = req.headers.origin || req.headers.referer || '';
  const match = origin.match(/^https?:\/\/([^/]+)/);
  if (!match) return res.status(400).json({ error: 'No site detected' });
  const site = match[1]; // e.g. "mysite.duda.co"

  // 2. Build Basic Auth from env vars
  const auth = Buffer.from(
    `${process.env.DUDA_USER}:${process.env.DUDA_PASS}`
  ).toString('base64');

  // 3. Fetch products from Duda API
  try {
    const apiRes = await fetch(
      `https://api.duda.co/api/sites/multiscreen/${site}/ecommerce/products`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      }
    );
    if (!apiRes.ok) throw new Error(`Duda API ${apiRes.status}`);
    const { products } = await apiRes.json();
    // 4. Return the JSON array
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.status(200).json(products);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
