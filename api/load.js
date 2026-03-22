module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method !== 'GET') return res.status(405).end();

    const { password, repo, file } = req.query;
    if (!password || password !== process.env.ADMIN_PASSWORD)
      return res.status(401).json({ error: 'Неверный пароль' });

    const r = await fetch(`https://api.github.com/repos/${repo}/contents/${file}`, {
      headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` }
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data.message });
    res.status(200).json({ content: data.content, sha: data.sha });
  };

  И api/save.js:

  module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).end();

    const { password, repo, file, content, sha, message } = req.body;
    if (!password || password !== process.env.ADMIN_PASSWORD)
      return res.status(401).json({ error: 'Неверный пароль' });

    const encoded = Buffer.from(content).toString('base64');
    const r = await fetch(`https://api.github.com/repos/${repo}/contents/${file}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message, content: encoded, sha })
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data.message });
    res.status(200).json({ sha: data.content.sha });
  };
