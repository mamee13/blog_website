const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./Routes/authRoutes');
const postRoutes = require('./Routes/postRoutes');
const contactRoutes = require('./Routes/contactRoutes');
const errorController = require('./Controllers/errorController');
const helmet = require('helmet');

// Load environment variables
dotenv.config({ path: './Config.env' });

// Initialize Express app
const app = express();

// Make sure these are set before your routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static('public/images'));

app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: [
        "'self'",
        "https://blog-website-1-q9js.onrender.com", // backend
        "https://blog-website-steel-iota.vercel.app", // frontend
        "http://localhost:3000" // local frontend development
      ],
      imgSrc: ["'self'", "data:", "blob:"], // Allow images from self, data URLs and blob URLs
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // May need these for certain frontend frameworks
      styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles
    }
  }
}));
// Middleware
// CORS Configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://blog-website-steel-iota.vercel.app',
    'https://blog-website-1-q9js.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization']
}));

// Make sure these are set before your routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static('public/images'));


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/contact', contactRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Blog API is running!');
});

// Add this after all your routes
app.use(errorController);

// Use helmet for security headers

module.exports = app; // Export the app for use in server.js