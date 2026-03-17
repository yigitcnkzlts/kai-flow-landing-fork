import mongoose from 'mongoose';

let connectionAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 2000; // 2 seconds

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in .env file');
    }

    console.log('\n🔗 ========== MONGODB CONNECTION ==========');
    console.log('🔗 Connecting to MongoDB Atlas...');
    
    await mongoose.connect(mongoUri, {
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 20,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      waitQueueTimeoutMS: 10000,
      retryWrites: true,
      retryReads: true,
    });
    
    connectionAttempts = 0;
    console.log('✅ MongoDB connected successfully');
    console.log('✅ Database:', mongoose.connection.db?.databaseName);
    console.log('✅ Connection State:', mongoose.connection.readyState, '(1 = connected)');
    console.log('✅ Pool Size: 20 (max), 5 (min)');
    console.log('========== CONNECTION SUCCESS ==========\n');
    
    // Handle connection events
    mongoose.connection.on('disconnected', () => {
      console.warn('\n⚠️  ========== MONGODB DISCONNECTED ==========');
      console.warn('⚠️  MongoDB connection lost');
      console.warn('⚠️  Attempting automatic reconnection...');
      console.warn('========== DISCONNECTED ==========\n');
      attemptReconnect();
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('\n❌ ========== MONGODB ERROR ==========');
      console.error('❌ MongoDB connection error:', err.message);
      console.error('========== ERROR ==========\n');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('\n✅ ========== MONGODB RECONNECTED ==========');
      console.log('✅ MongoDB reconnected successfully');
      console.log('✅ Connection State:', mongoose.connection.readyState);
      console.log('========== RECONNECTED ==========\n');
      connectionAttempts = 0;
    });
    
    return mongoose.connection;
  } catch (error) {
    console.error('\n❌ ========== MONGODB CONNECTION FAILED ==========');
    console.error('❌ Error:', error.message);
    console.error('❌ Make sure:');
    console.error('   - MONGO_URI is correct in .env');
    console.error('   - Your IP is whitelisted in MongoDB Atlas (0.0.0.0/0)');
    console.error('   - Database user credentials are correct');
    console.error('   - Network connection is available');
    console.error('========== CONNECTION FAILED ==========\n');
    
    // Try to reconnect
    attemptReconnect();
    return null;
  }
};

const attemptReconnect = async () => {
  if (connectionAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.error('❌ Max reconnection attempts reached');
    return;
  }

  connectionAttempts++;
  console.log(`\n🔄 Reconnection attempt ${connectionAttempts}/${MAX_RECONNECT_ATTEMPTS}...`);
  
  setTimeout(async () => {
    try {
      await connectDB();
    } catch (err) {
      console.error('❌ Reconnection attempt failed:', err.message);
    }
  }, RECONNECT_DELAY);
};

// Export function to check and ensure connection
export const ensureConnection = async () => {
  if (mongoose.connection.readyState !== 1) {
    console.warn('⚠️  MongoDB not connected, attempting to reconnect...');
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        retryWrites: true,
        w: 'majority',
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        maxPoolSize: 20,
        minPoolSize: 5,
      });
      console.log('✅ Reconnected to MongoDB');
      return true;
    } catch (err) {
      console.error('❌ Failed to reconnect:', err.message);
      return false;
    }
  }
  return true;
};

export default connectDB;
