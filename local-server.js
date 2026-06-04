const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and urlencoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use(require('./api/index'));

// Serve Static Directories
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// Serve Root Level Pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/index.html', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/products.html', (req, res) => res.sendFile(path.join(__dirname, 'products.html')));
app.get('/product-details.html', (req, res) => res.sendFile(path.join(__dirname, 'product-details.html')));
app.get('/cart.html', (req, res) => res.sendFile(path.join(__dirname, 'cart.html')));
app.get('/about.html', (req, res) => res.sendFile(path.join(__dirname, 'about.html')));
app.get('/contact.html', (req, res) => res.sendFile(path.join(__dirname, 'contact.html')));

// Serve Admin Pages
app.get('/private-control-room/login.html', (req, res) => res.sendFile(path.join(__dirname, 'private-control-room/login.html')));
app.get('/private-control-room/dashboard.html', (req, res) => res.sendFile(path.join(__dirname, 'private-control-room/dashboard.html')));
app.get('/private-control-room/products.html', (req, res) => res.sendFile(path.join(__dirname, 'private-control-room/products.html')));
app.get('/private-control-room/categories.html', (req, res) => res.sendFile(path.join(__dirname, 'private-control-room/categories.html')));
app.get('/private-control-room/enquiries.html', (req, res) => res.sendFile(path.join(__dirname, 'private-control-room/enquiries.html')));

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
