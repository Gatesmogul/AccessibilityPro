require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Core Configuration and Infrastructure Layers
const db = require('./config/db');
const { globalErrorHandler, AppError } = require('./middleware/errorHandler');

// Structural Database Schema Models
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
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * ============================================================================
 * 2. Primary Domain Routing Table Mount Points
 * ============================================================================
 */

// Defensive validation wrapper to intercept missing or invalid router module exports
const verifyRouter = (routeName, routeModule) => {
  if (!routeModule || (typeof routeModule !== 'function' && typeof routeModule.use !== 'function')) {
    console.error(`🚨 CRITICAL CONFIGURATION FAULT: "${routeName}" did not export a valid Express router function or object instance!`);
    
    // Fallback handler to prevent hard initialization crashes on app.use()
    return (req, res) => res.status(503).json({ 
      success: false, 
      message: `The resource gateway for ${routeName} is temporarily offline due to an internal configuration mismatch.` 
    });
  }
  return routeModule;
};

app.use('/api/v1/auth', verifyRouter('authRoutes', authRoutes));
app.use('/api/v1/products', verifyRouter('productRoutes', productRoutes));
app.use('/api/v1/cart', verifyRouter('cartRoutes', cartRoutes));

// Health endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'UP',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

/**
 * ============================================================================
 * 3. Expo Web Frontend Static Client Engine Mount
 * ============================================================================
 */

const distPath = path.join(__dirname, '../../dist');

// Serve static assets
app.use(express.static(distPath));

// SPA fallback (Express 5 compatible)
app.use((req, res, next) => {
  // Let API routes continue
  if (
    req.path.startsWith('/api') ||
    req.path === '/health'
  ) {
    return next();
  }

  // Only serve index.html for browser GET requests
  if (req.method === 'GET') {
    return res.sendFile(path.join(distPath, 'index.html'));
  }

  next();
});

/**
 * ============================================================================
 * 4. Post-Routing Error Catching Stack
 * ============================================================================
 */

app.use((req, res, next) => {
  next(
    new AppError(
      `The requested endpoint resource [${req.method}] ${req.originalUrl} does not exist on this server cluster.`,
      404
    )
  );
});

app.use(globalErrorHandler);

/**
 * ============================================================================
 * 5. Cluster Boot-up and Structural Migration Sequencer
 * ============================================================================
 */

async function initializePlatformServer() {
  console.log('🔄 Booting AccessibilityPro API backend ecosystem platform...');

  // Verify database connectivity
  const isDatabaseOnline = await db.verifyConnectivity();

  if (!isDatabaseOnline) {
    console.error(
      '🚨 Critical startup failure: Database cluster link returned offline status.'
    );
    process.exit(1);
  }

  try {
    console.log(
      '📦 Enforcing relational schema check matrices across structural models...'
    );

    await UserModel.initializeTable();
    await ProductModel.initializeTable();
    await CartModel.initializeTable();

    console.log(
      '✅ All structural entity schema validations verified successfully.'
    );
  } catch (migrationError) {
    console.error(
      '🚨 Critical database schema migration sequence crashed:',
      migrationError.message
    );
    process.exit(1);
  }

  const serverInstance = app.listen(PORT, () => {
    console.log('======================================================================');
    console.log(`🚀 RUNNING: Server cluster listening securely on port ${PORT}`);
    console.log(
      `🌐 MODE: ${process.env.NODE_ENV || 'development'}`
    );
    console.log('======================================================================');
  });

  process.on('unhandledRejection', (reason) => {
    console.error('🚨 CRITICAL UNHANDLED PROMISE REJECTION:', reason);

    serverInstance.close(() => {
      process.exit(1);
    });
  });
}

initializePlatformServer();
