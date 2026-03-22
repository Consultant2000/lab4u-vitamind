const https = require('https');

function ghRequest(url, options) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let parsed;
        try { parsed = JSON.parse(body); } catch(e) { parsed = { message: body }; }
        resolve({ status: res.statusCode, body: parsed });
      });
    });
    req.on('error', reject);
    req.end();
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).end();

  const { password, repo, file } = req.query;
  if (!password || password !== process.env.ADMIN_PASSWORD)
    return res.status(401).json({ error: 'Неверный пароль' });

  try {
    const url = `https://api.github.com/repos/${repo}/contents/${file}`;
    const { status, body } = await ghRequest(url, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        'User-Agent': 'lab4u-admin',
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    if (status !== 200) return res.status(status).json({ error: body.message || JSON.stringify(body) });
    res.status(200).json({ content: body.content, sha: body.sha });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
};
