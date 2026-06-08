const db = require('../lib/db');

module.exports = async (req, res) => {
  try {
    const baseUrl = 'https://msp-cqtv.vercel.app'; // Production Base URL

    // Fetch products and categories
    const [products] = await db.query('SELECT id, created_at FROM products WHERE status = ?', ['active']);
    const [categories] = await db.query('SELECT name FROM categories WHERE status = ?', ['active']);

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // 1. Static Pages
    const staticPages = [
      { path: '', priority: '1.0', changefreq: 'daily' },
      { path: '/about', priority: '0.8', changefreq: 'monthly' },
      { path: '/contact', priority: '0.8', changefreq: 'monthly' },
      { path: '/products', priority: '0.9', changefreq: 'daily' }
    ];

    for (const page of staticPages) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${page.path}</loc>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    // 2. Category Filter Pages
    for (const cat of categories) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/products?cat=${encodeURIComponent(cat.name)}</loc>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    }

    // 3. Product Detail Pages
    for (const prod of products) {
      const lastMod = prod.created_at ? new Date(prod.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/product-details?id=${prod.id}</loc>\n`;
      xml += `    <lastmod>${lastMod}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    }

    xml += '</urlset>\n';

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate'); // Cache for 24h on CDN
    return res.status(200).send(xml);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return res.status(500).send('Error generating sitemap');
  }
};
