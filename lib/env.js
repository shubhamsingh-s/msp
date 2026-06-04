const REQUIRED_ENV_VARS = [
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'JWT_SECRET'
];

function validateEnv() {
  const missing = [];
  for (const name of REQUIRED_ENV_VARS) {
    if (!process.env[name]) {
      missing.push(name);
    }
  }

  // Cloudinary check: Either CLOUDINARY_URL is present, or all individual keys are present
  const hasCloudinaryUrl = !!process.env.CLOUDINARY_URL;
  const hasIndividualCloudinary = 
    !!process.env.CLOUDINARY_CLOUD_NAME && 
    !!process.env.CLOUDINARY_API_KEY && 
    !!process.env.CLOUDINARY_API_SECRET;

  if (!hasCloudinaryUrl && !hasIndividualCloudinary) {
    missing.push('CLOUDINARY_URL (or CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)');
  }

  if (missing.length > 0) {
    const errorMsg = `Configuration Error: Missing required environment variable(s): ${missing.join(', ')}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

module.exports = {
  validateEnv
};
