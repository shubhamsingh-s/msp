const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Parse request bodies and cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Route incoming API calls to their respective handlers
app.get('/api/products', require('./products'));
app.get('/api/product', require('./product'));
app.post('/api/add-product', require('./add-product'));
app.put('/api/update-product', require('./update-product'));
app.delete('/api/delete-product', require('./delete-product'));

app.post('/api/add-enquiry', require('./add-enquiry'));
app.get('/api/enquiries', require('./enquiries'));
app.put('/api/enquiries', require('./enquiries'));
app.delete('/api/enquiries', require('./enquiries'));

app.get('/api/categories', require('./categories'));
app.post('/api/categories', require('./categories'));
app.put('/api/categories', require('./categories'));
app.delete('/api/categories', require('./categories'));

app.post('/api/login', require('./login'));
app.post('/api/logout', require('./logout'));
app.get('/api/check-auth', require('./check-auth'));

module.exports = app;
module.exports.config = {
  api: {
    bodyParser: false
  }
};
