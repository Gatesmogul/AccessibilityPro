require('dotenv').config();
const express = require('express');
const cors = require('cors');

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
 * 3. Post-Routing Error Catching Stack
 * ============================================================================
 */

// FIX: Pathless middleware fallback interceptor catching all unregistered, arbitrary route paths
app.use((req, res, next) => {
  next(new AppError(`The requested endpoint resource [${req.method}] ${req.originalUrl} does not exist on this server cluster.`, 404));
});

// Load the centralized global exception handler last
app.use(globalErrorHandler);

/**
 * ============================================================================
 * 4. Cluster Boot-up and Structural Migration Sequencer
 * ============================================================================
 */
async function initializePlatformServer() {
  console.log('🔄 Booting AccessibilityPro API backend ecosystem platform...');
  
  // Phase A: Assert core socket connectivity with the PostgreSQL cluster
  const isDatabaseOnline = await db.verifyConnectivity();
  if (!isDatabaseOnline) {
    console.error('🚨 Critical startup failure: Database cluster link returned offline status. Halting application launch.');
    process.exit(1);
  }

  // Phase B: Execute ordered structural layout validations (Migrations)
  try {
    console.log('📦 Enforcing relational schema check matrices across structural models...');
    
    // Ordered safely to satisfy foreign key link constraints natively
    await UserModel.initializeTable();
    await ProductModel.initializeTable();
    await CartModel.initializeTable();
    
    console.log('✅ All structural entity schema validations verified successfully.');
  } catch (migrationError) {
    console.error('🚨 Critical database schema migration sequence crashed:', migrationError.message);
    process.exit(1);
  }

  // Phase C: Spin up operational network listeners
  const serverInstance = app.listen(PORT, () => {
    console.log(`======================================================================`);
    console.log(`🚀 RUNNING: Server cluster listening securely on port: ${PORT}`);
    console.log(`🌐 MODE: Active environment profile context: ${process.env.NODE_ENV || 'development'}`);
    console.log(`======================================================================`);
  });

  // Track unhandled asynchronous promise rejections to protect system processes
  process.on('unhandledRejection', (reason, promise) => {
    console.error('🚨 CRITICAL UNHANDLED PROMISE REJECTION CAPTURED:', reason);
    // Gracefully offload connections before killing process loops under panic states
    serverInstance.close(() => {
      process.exit(1);
    });
  });
}

// Fire startup initialization engine sequence
initializePlatformServer();
