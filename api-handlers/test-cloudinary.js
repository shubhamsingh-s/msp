const { uploadToCloudinary } = require('../lib/cloudinary');

module.exports = async (req, res) => {
  try {
    // Tiny 1x1 transparent PNG buffer
    const testBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
      'base64'
    );
    
    console.log('Testing Cloudinary upload with a tiny image...');
    const url = await uploadToCloudinary(testBuffer, { folder: 'test_uploads' });
    
    return res.status(200).json({
      success: true,
      message: 'Cloudinary upload test successful!',
      url
    });
  } catch (error) {
    console.error('Cloudinary Test Upload Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Unknown error',
      details: error
    });
  }
};
