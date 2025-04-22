const DUDA_API_USER = process.env.DUDA_API_USER;
const DUDA_API_PASS = process.env.DUDA_API_PASS;
const SITE_NAME = process.env.DUDA_SITE_NAME;

export default async function handler(req, res) {
  const auth = Buffer.from(`${DUDA_API_USER}:${DUDA_API_PASS}`).toString('base64');

  try {
    const response = await fetch(`https://api.duda.co/api/sites/multiscreen/${SITE_NAME}/ecommerce/catalog/products`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.toString() });
  }
}
