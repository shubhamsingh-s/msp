const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Restore original req.url from Vercel's rewrite headers
app.use((req, res, next) => {
  const originalPath = req.headers['x-vercel-forwarded-path'] || req.headers['x-forwarded-path'];
  if (originalPath) {
    req.url = originalPath;
  }
  next();
});

// Parse request bodies and cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Route incoming API calls to their respective handlers
app.get('/api/products', require('../api-handlers/products'));
app.get('/api/product', require('../api-handlers/product'));
app.post('/api/add-product', require('../api-handlers/add-product'));
app.put('/api/update-product', require('../api-handlers/update-product'));
app.delete('/api/delete-product', require('../api-handlers/delete-product'));

app.post('/api/add-enquiry', require('../api-handlers/add-enquiry'));
app.get('/api/enquiries', require('../api-handlers/enquiries'));
app.put('/api/enquiries', require('../api-handlers/enquiries'));
app.delete('/api/enquiries', require('../api-handlers/enquiries'));

app.get('/api/categories', require('../api-handlers/categories'));
app.post('/api/categories', require('../api-handlers/categories'));
app.put('/api/categories', require('../api-handlers/categories'));
app.delete('/api/categories', require('../api-handlers/categories'));

app.post('/api/login', require('../api-handlers/login'));
app.post('/api/logout', require('../api-handlers/logout'));
app.get('/api/check-auth', require('../api-handlers/check-auth'));
app.get('/api/debug', require('../api-handlers/debug'));
app.get('/api/test-cloudinary', require('../api-handlers/test-cloudinary'));
app.get('/api/test-update', require('../api-handlers/test-update'));

module.exports = app;
module.exports.config = {
  api: {
    bodyParser: false
  }
};
