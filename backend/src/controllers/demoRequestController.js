import DemoRequest from '../models/DemoRequest.js';
import mongoose from 'mongoose';
import { ensureConnection } from '../config/db.js';

export const createDemoRequest = async (req, res) => {
  try {
    console.log('\n📨 ========== NEW DEMO REQUEST ==========');
    console.log('📥 Request Body:', JSON.stringify(req.body, null, 2));

    // CRITICAL: Ensure MongoDB connection before processing
    console.log('🔍 Checking MongoDB connection...');
    const isConnected = await ensureConnection();
    
    if (!isConnected) {
      console.error('❌ MongoDB connection failed after retry');
      return res.status(503).json({
        success: false,
        message: 'Database connection failed. Please try again later.',
      });
    }

    const {
      fullName,
      email,
      phone,
      company,
      jobTitle,
      message,
      country,
      companySize,
      interests,
      acceptedKvkk,
      acceptedMarketing,
    } = req.body;

    // Log database connection state
    console.log('✅ MongoDB connected');
    console.log('🗄️  Connection State:', mongoose.connection.readyState, '(1 = connected)');
    console.log('🗄️  Database:', mongoose.connection.db?.databaseName || 'not connected');
    console.log('🗄️  Collection Name:', DemoRequest.collection.name);

    // Validate required fields
    if (!fullName || !email || !phone || !acceptedKvkk) {
      console.error('❌ Validation failed: Missing required fields');
      console.error('   - fullName:', fullName ? '✓' : '✗');
      console.error('   - email:', email ? '✓' : '✗');
      console.error('   - phone:', phone ? '✓' : '✗');
      console.error('   - acceptedKvkk:', acceptedKvkk ? '✓' : '✗');
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: fullName, email, phone, acceptedKvkk',
      });
    }

    console.log('✅ Validation passed - all required fields present');

    // Create new demo request
    console.log('📝 Creating new DemoRequest document...');
    const demoRequest = new DemoRequest({
      fullName,
      email,
      phone,
      company,
      jobTitle,
      message,
      country,
      companySize,
      interests,
      acceptedKvkk,
      acceptedMarketing,
    });

    console.log('📝 Document created (not saved yet)');

    // Save to database
    console.log('💾 Saving to MongoDB...');
    const savedRequest = await demoRequest.save();

    console.log('\n✅ ========== SUCCESS ==========');
    console.log('✅ Successfully saved to MongoDB');
    console.log('✅ Document ID:', savedRequest._id);
    console.log('✅ Email:', savedRequest.email);
    console.log('✅ Full Name:', savedRequest.fullName);
    console.log('✅ Phone:', savedRequest.phone);
    console.log('✅ Company:', savedRequest.company);
    console.log('✅ Job Title:', savedRequest.jobTitle);
    console.log('✅ Country:', savedRequest.country);
    console.log('✅ Company Size:', savedRequest.companySize);
    console.log('✅ Interests:', savedRequest.interests);
    console.log('✅ Created At:', savedRequest.createdAt);
    console.log('✅ Collection:', DemoRequest.collection.name);
    console.log('========== REQUEST COMPLETE ==========\n');

    return res.status(201).json({
      success: true,
      message: 'Demo request received and saved successfully',
      data: {
        id: savedRequest._id,
        email: savedRequest.email,
        fullName: savedRequest.fullName,
        createdAt: savedRequest.createdAt,
      },
    });
  } catch (error) {
    console.error('\n❌ ========== ERROR ==========');
    console.error('❌ Error Type:', error.name);
    console.error('❌ Error Message:', error.message);
    console.error('❌ Error Stack:', error.stack);
    console.error('========== ERROR END ==========\n');

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      console.error('❌ Validation Errors:', messages);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages,
      });
    }

    // Handle MongoDB connection errors
    if (error.name === 'MongoNetworkError' || error.name === 'MongoServerError') {
      console.error('❌ MongoDB Network Error - attempting reconnection');
      return res.status(503).json({
        success: false,
        message: 'Database connection failed. Please try again later.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to create demo request',
      error: error.message,
    });
  }
};

export const getDemoRequests = async (req, res) => {
  try {
    console.log('\n📨 ========== GET ALL DEMO REQUESTS ==========');
    
    // Ensure connection
    const isConnected = await ensureConnection();
    if (!isConnected) {
      return res.status(503).json({
        success: false,
        message: 'Database connection failed',
        data: [],
      });
    }

    console.log('🗄️  MongoDB Connection State:', mongoose.connection.readyState);
    console.log('🗄️  MongoDB Database:', mongoose.connection.db?.databaseName || 'not connected');

    const requests = await DemoRequest.find().sort({ createdAt: -1 });

    console.log(`✅ Found ${requests.length} requests`);
    console.log('========== GET COMPLETE ==========\n');

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error('❌ Error fetching demo requests:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch demo requests',
      error: error.message,
    });
  }
};

export const getDemoRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('\n📨 ========== GET DEMO REQUEST BY ID ==========');
    console.log('🔍 Request ID:', id);

    // Ensure connection
    const isConnected = await ensureConnection();
    if (!isConnected) {
      return res.status(503).json({
        success: false,
        message: 'Database connection failed',
      });
    }

    const request = await DemoRequest.findById(id);

    if (!request) {
      console.error('❌ Request not found');
      return res.status(404).json({
        success: false,
        message: 'Demo request not found',
      });
    }

    console.log('✅ Request found');
    console.log('========== GET BY ID COMPLETE ==========\n');

    return res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error('❌ Error fetching demo request:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch demo request',
      error: error.message,
    });
  }
};
