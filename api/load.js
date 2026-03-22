const https = require('https');

function ghGet(path, token) {
  return new Promise((resolve, reject) => {
    https.get(
      {
        hostname: 'api.github.com',
        path,
        headers: { Authorization: `token ${token}`, 'User-Agent': 'lab4u-admin' }
      },
      (res) => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(d) }));
      }
    ).on('error', reject);
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).end();

  const { password, repo, file } = req.query;
  if (!password || password !== process.env.ADMIN_PASSWORD)
    return res.status(401).json({ error: 'Неверный пароль' });

  const { status, body } = await ghGet(
    `/repos/${repo}/contents/${file}`,
    process.env.GITHUB_TOKEN
  );
  if (status !== 200) return res.status(status).json({ error: body.message });
  res.status(200).json({ content: body.content, sha: body.sha });
};
