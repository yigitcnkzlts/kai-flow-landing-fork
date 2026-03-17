import dotenv from 'dotenv';
import app from './src/app.js';
import connectDB from './src/config/db.js';

// Load environment variables
dotenv.config();

const requestedPort = Number(process.env.PORT) || 5000;
const MAX_PORT_TRIES = 10;

console.log('\n🚀 ========== SERVER STARTUP ==========');
console.log('🚀 Starting Kai Flow Backend...\n');

// Connect to MongoDB (non-blocking - server continues even if connection fails)
connectDB().catch((err) => {
  console.error('⚠️  MongoDB connection failed');
  console.error('⚠️  Error:', err.message);
});

function logServerReady(port) {
  console.log(`✅ Server running on port ${port}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Backend: http://localhost:${port}`);
  console.log(`🔗 Health Check: http://localhost:${port}/api/health`);
  console.log(`🔗 Demo Request: POST http://localhost:${port}/api/demo-request`);
  console.log('========== SERVER READY ==========\n');
}

function logPortInUse(port, attempt) {
  console.error('\n❌ ========== PORT IN USE ==========');
  console.error(`❌ Cannot start backend on port ${port} (EADDRINUSE)`);
  console.error(`❌ Attempt ${attempt}/${MAX_PORT_TRIES}`);
  console.error('❌ Fix: Stop the process using this port, or set PORT in backend/.env');
  console.error('========== ERROR END ==========\n');
}

function listenOnPort(port, attempt = 1) {
  const server = app.listen(port, () => {
    process.env.PORT = String(port);
    logServerReady(port);
  });

  server.on('error', (err) => {
    if (err?.code === 'EADDRINUSE') {
      server.close();
      logPortInUse(port, attempt);

      if (attempt < MAX_PORT_TRIES) {
        const nextPort = port + 1;
        console.log(`🔁 Retrying on port ${nextPort}...`);
        listenOnPort(nextPort, attempt + 1);
        return;
      }

      console.error('🛑 Exhausted port retry attempts. Backend not started.');
      process.exit(1);
    } else {
      console.error('\n❌ ========== SERVER START ERROR ==========');
      console.error('❌ Error:', err?.message || err);
      console.error('❌ Code:', err?.code);
      console.error('========== ERROR END ==========\n');
      process.exit(1);
    }
  });
}

listenOnPort(requestedPort);
