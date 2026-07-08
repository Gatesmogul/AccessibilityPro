require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // Absolute directory path resolver

// Core Configuration and Infrastructure Layers
const db = require('./config/db');
const { globalErrorHandler, AppError } = require('./middleware/errorHandler');

// Structural Database Schema Models (Used for table initialization checks)
const UserModel = require('./models/User');
const ProductModel = require('./models/Product');
const CartModel = require('./models/Cart');

// API Domain Routing Modules
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

/**
 * ============================================================================
 * 1. Global Pre-Routing Middleware Configuration Stack
 * ============================================================================
 */
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

// Inbound payload parser interceptors (allocating a standard 10mb limit window)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * ============================================================================
 * 2. Primary Domain Routing Table Mount Points
 * ============================================================================
 */
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes);

// Surface level API baseline health diagnostic endpoint
app.get('/health', async (req, res) => {
  res.status(200).json({
    success: true,
    status: 'UP',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * ============================================================================
 * 3. Expo Web Frontend Static Client Engine Mount
 * ============================================================================
 */
// A. FIX: Clamber up two levels ('../../') to find the root 'dist' folder from 'backend/src'
app.use(express.static(path.join(__dirname, '../../dist')));

// B. Intercept non-API route page requests to render your React Native screens on the web
// FIX: Changed '*' to '(.*)' to completely satisfy new path-to-regexp parsing metrics
app.get('(.*)', (req, res, next) => {
  // If the inbound request path targets an API gateway route, bypass static hosting rules
  if (req.path.startsWith('/api') || req.path === '/health') {
    return next();
  }
  // FIX: Clamber up two levels ('../../') to safely deliver the main entry frame
  res.sendFile(path.join(__dirname, '../../dist', 'index.html'));
});

/**
 * ============================================================================
 * 4. Post-Routing Error Catching Stack
 * ============================================================================
 */

// Pathless middleware fallback interceptor catching all unregistered, arbitrary route paths
app.use((req, res
