module.exports = async (req, res) => {
  const host = req.headers.host || 'msp-cqtv.vercel.app';
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  
  let txt = 'User-agent: *\n';
  txt += 'Allow: /\n';
  // Disallow secure/private directories from indexing
  txt += 'Disallow: /private-control-room/\n';
  txt += 'Disallow: /api/\n';
  txt += '\n';
  txt += `Sitemap: ${protocol}://${host}/sitemap.xml\n`;

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
  return res.status(200).send(txt);
};
