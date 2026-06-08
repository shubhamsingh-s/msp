const db = require('../lib/db');

module.exports = async (req, res) => {
  try {
    console.log('Testing update on product ID 1...');
    
    // First, select the product to make sure it exists
    const [rows] = await db.query('SELECT * FROM products WHERE id = 1');
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Product with ID 1 not found' });
    }
    
    const p = rows[0];
    console.log('Product found:', p.name);
    
    // Attempt to update it (touching the description slightly or keeping it the same)
    const [result] = await db.query(
      `UPDATE products 
       SET name = ?, category = ?, composition = ?, packaging = ?, featured = ?, status = ?, description = ?, image_url = ?, pdf_url = ?
       WHERE id = ?`,
      [p.name, p.category, p.composition, p.packaging, p.featured, p.status, p.description, p.image_url, p.pdf_url, 1]
    );
    
    return res.status(200).json({
      success: true,
      message: 'Product update successful!',
      affectedRows: result.affectedRows,
      changedRows: result.changedRows
    });
  } catch (error) {
    console.error('Test Update Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Unknown database error',
      details: error
    });
  }
};
