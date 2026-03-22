export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).end();

  const { password, repo, file } = req.query;
  if (password !== process.env.ADMIN_PASSWORD)
    return res.status(401).json({ error: 'Неверный пароль' });

  const r = await fetch(`https://api.github.com/repos/${repo}/contents/${file}`, {
    headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` }
  });
  const data = await r.json();
  if (!r.ok) return res.status(r.status).json({ error: data.message });
  return res.status(200).json({ content: data.content, sha: data.sha });
}
