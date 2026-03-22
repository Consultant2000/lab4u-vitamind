const https = require('https');

function ghPut(path, token, data) {
  const body = JSON.stringify(data);
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'api.github.com',
        path,
        method: 'PUT',
        headers: {
          Authorization: `token ${token}`,
          'User-Agent': 'lab4u-admin',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        }
      },
      (res) => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(d) }));
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { password, repo, file, content, sha, message } = req.body;
  if (!password || password !== process.env.ADMIN_PASSWORD)
    return res.status(401).json({ error: 'Неверный пароль' });

  const encoded = Buffer.from(content).toString('base64');
  const { status, body } = await ghPut(
    `/repos/${repo}/contents/${file}`,
    process.env.GITHUB_TOKEN,
    { message, content: encoded, sha }
  );
  if (status !== 200 && status !== 201) return res.status(status).json({ error: body.message });
  res.status(200).json({ sha: body.content.sha });
};
