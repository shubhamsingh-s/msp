const db = require('../lib/db');
const fs = require('fs');
const path = require('path');

let htmlTemplate = null;

module.exports = async (req, res) => {
  try {
    const { id } = req.query;
    
    // Load product-details-template.html file from disk if not cached
    if (!htmlTemplate) {
      const filePath = path.join(process.cwd(), 'product-details-template.html');
      htmlTemplate = fs.readFileSync(filePath, 'utf8');
    }
    
    // If no ID or database query fails, return standard template
    if (!id) {
      return res.status(200).send(htmlTemplate);
    }
    
    let product = null;
    try {
      const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
      if (rows.length > 0) {
        product = rows[0];
      }
    } catch (dbError) {
      console.error('Database query error in SEO handler:', dbError);
    }
    
    if (!product) {
      // Return standard template if product not found in DB
      return res.status(200).send(htmlTemplate);
    }

    const host = req.headers.host || 'msp-cqtv.vercel.app';
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const currentUrl = `${protocol}://${host}/product-details?id=${product.id}`;
    
    // Create SEO strings
    const seoTitle = `${product.name} | ${product.category} Division | MSP Bharat`;
    const seoDescription = `Browse specifications, composition (${product.composition}), packaging (${product.packaging}), and download brochures for ${product.name} from Maa Sukriti Pharmaceuticals.`;
    const seoKeywords = `${product.name}, ${product.composition}, ${product.category}, pharmaceutical formulations, medicine supplier India, Lucknow pharma distributor`;
    const imageUrl = product.image_url || `${protocol}://${host}/assets/logos/logo.png`;

    // Construct Breadcrumb Schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": `${protocol}://${host}/`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Products",
          "item": `${protocol}://${host}/products`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": product.name,
          "item": currentUrl
        }
      ]
    };

    // Construct Product Schema
    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "image": imageUrl,
      "description": product.description || seoDescription,
      "category": product.category,
      "brand": {
        "@type": "Brand",
        "name": "Maa Sukriti Pharmaceuticals"
      },
      "offers": {
        "@type": "Offer",
        "url": currentUrl,
        "price": "0.00",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
        "priceValidUntil": "2030-12-31"
      }
    };

    // Build replacement header block
    let headerAdditions = `
  <title>${seoTitle}</title>
  <meta name="description" content="${seoDescription}">
  <meta name="keywords" content="${seoKeywords}">
  
  <!-- Dynamic Open Graph Tags -->
  <meta property="og:title" content="${seoTitle}">
  <meta property="og:description" content="${seoDescription}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:url" content="${currentUrl}">
  <meta property="og:type" content="product">
  
  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${seoTitle}">
  <meta name="twitter:description" content="${seoDescription}">
  <meta name="twitter:image" content="${imageUrl}">

  <!-- JSON-LD Breadcrumb Schema -->
  <script type="application/ld+json">
  ${JSON.stringify(breadcrumbSchema)}
  </script>

  <!-- JSON-LD Product Schema -->
  <script type="application/ld+json">
  ${JSON.stringify(productSchema)}
  </script>
    `;

    // Perform replacements in HTML
    let dynamicHtml = htmlTemplate;
    
    // Replace title tag
    dynamicHtml = dynamicHtml.replace(
      /<title>Product Details \| Maa Sukriti Pharmaceuticals<\/title>/i,
      ''
    );
    
    // Replace description tag with full block of SEO headers
    dynamicHtml = dynamicHtml.replace(
      /<meta name="description" content="Detailed pharmaceutical properties, composition, packaging, and brochure downloads for Maa Sukriti Pharmaceuticals formulations.">/i,
      headerAdditions
    );

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=600'); // Cache on CDN for 1 hour
    return res.status(200).send(dynamicHtml);
  } catch (error) {
    console.error('Error in dynamic SEO handler:', error);
    // Fallback: send static file on error
    if (htmlTemplate) {
      return res.status(200).send(htmlTemplate);
    }
    return res.status(500).send('Internal Server Error');
  }
};
