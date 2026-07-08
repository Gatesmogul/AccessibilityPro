const { Pool } = require('pg');

/**
 * Configure runtime infrastructure credentials safely using server-side environment variables.
 * In a professional production pipeline, never hardcode plaintext credentials.
 */
const isProduction = process.env.NODE_ENV === 'production';

// Connection string composition fallback pattern
const connectionString = process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

/**
 * Thread-Safe Database Connection Pool Initialization Engine
 */
const pool = new Pool({
  connectionString: connectionString,
  // Enforce SSL layer specifications strictly in cloud-hosted multi-tenant production topologies (AWS RDS, Heroku, Supabase, Neon)
  ssl: isProduction 
    ? { rejectUnauthorized: false } 
    : false,
  
  // Advanced Pooling Allocation Limits
  max: isProduction ? 20 : 5,      // Maximum active operational clients allocated to the pool matrix
  idleTimeoutMillis: 30000,         // Close idle connection links automatically after 30 seconds
  connectionTimeoutMillis: 2000,    // Return a timeout exception line if a connection slot takes over 2 seconds
});

/**
 * Global Pool Lifecycle Observer Anchors
 * Captures idle internal database faults or sudden TCP reset drops without crashing the Node engine.
 */
pool.on('error', (err, client) => {
  console.error('Unexpected database execution error caught on an idle connection client thread:', err.message);
});

pool.on('connect', () => {
  if (!isProduction) {
    console.log('Database Router Module: New database client client pooled successfully.');
  }
});

module.exports = {
  /**
   * Primary query execution abstraction. Use this standard function across 
   * your controller handlers to instantly grab a connection, complete a query, and return it to the pool.
   * * @param {string} text - Valid parameterized SQL Statement syntax string line 
   * @param {Array} params - Array parameters injected safely to insulate against SQL Injection vectors
   */
  async query(text, params) {
    const start = Date.now();
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      
      // Keep tracking telemetry enabled during active developer test loops
      if (!isProduction) {
        console.log('Executed Database Query:', { text, duration: `${duration}ms`, rowsCount: res.rowCount });
      }
      
      return res;
    } catch (error) {
      console.error('Database Layer Processing Exception Encountered:', { text, error: error.message });
      throw error;
    }
  },

  /**
   * Multi-statement transaction worker. Use this explicit reservation block 
   * when processing isolated structural changes (e.g., matching a payment receipt to a cart order simultaneously).
   */
  async getTransactionClient() {
    const client = await pool.connect();
    const query = client.query;
    const release = client.release;
    
    // Bind telemetry timeouts to prevent unreleased transactional leaks from blocking pools indefinitely
    const timeout = setTimeout(() => {
      console.error('A transaction client checkout slot has been running for over 5 seconds! Potential connection lock leak.');
    }, 5000);
    
    client.release = (err) => {
      clearTimeout(timeout);
      client.query = query;
      client.release = release;
      return release.call(client, err);
    };
    
    return client;
  },

  /**
   * Health verification check invoked during initialization routines to verify data connectivity.
   */
  async verifyConnectivity() {
    try {
      const res = await this.query('SELECT NOW() AS current_system_timestamp');
      console.log(`🚀 PostgreSQL Engine online. Server Connection Verified. Cluster Time: ${res.rows[0].current_system_timestamp}`);
      return true;
    } catch (err) {
      console.error('🚨 PostgreSQL Cluster Initialization Failure: Cannot connect to DB instance.', err.message);
      return false;
    }
  },

  // Export direct handle to the root pool context if required by external dependency migration layers
  pool
};