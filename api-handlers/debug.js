module.exports = async (req, res) => {
  const vars = {
    DB_HOST: process.env.DB_HOST ? process.env.DB_HOST.substring(0, 10) + '...' : 'NOT SET',
    DB_PORT: process.env.DB_PORT || 'NOT SET',
    DB_USER: process.env.DB_USER ? process.env.DB_USER.substring(0, 5) + '...' : 'NOT SET',
    DB_PASSWORD: process.env.DB_PASSWORD ? '***SET***' : 'NOT SET',
    DB_NAME: process.env.DB_NAME || 'NOT SET',
    DB_SSL: process.env.DB_SSL || 'NOT SET',
    NODE_ENV: process.env.NODE_ENV || 'NOT SET',
    NODE_VERSION: process.version || 'UNKNOWN',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? `(Length: ${process.env.CLOUDINARY_CLOUD_NAME.length}) ${process.env.CLOUDINARY_CLOUD_NAME.substring(0, 3)}...` : 'NOT SET',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? `(Length: ${process.env.CLOUDINARY_API_KEY.length}) ${process.env.CLOUDINARY_API_KEY.substring(0, 3)}...` : 'NOT SET',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? `(Length: ${process.env.CLOUDINARY_API_SECRET.length}) ${process.env.CLOUDINARY_API_SECRET.substring(0, 3)}...` : 'NOT SET',
    CLOUDINARY_URL: process.env.CLOUDINARY_URL ? `(Length: ${process.env.CLOUDINARY_URL.length}) ${process.env.CLOUDINARY_URL.substring(0, 15)}...` : 'NOT SET',
  };
  return res.status(200).json(vars);
};
