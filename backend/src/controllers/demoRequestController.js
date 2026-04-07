import DemoRequest from '../models/DemoRequest.js';
import mongoose from 'mongoose';
import { ensureConnection } from '../config/db.js';
import axios from 'axios';

// Verify reCAPTCHA token with Google
async function verifyRecaptcha(token) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  
  // Check if secret key is valid (not placeholder)
  const isValidSecretKey = secretKey && 
                           secretKey !== 'your_recaptcha_secret_key_here' && 
                           !secretKey.includes('your_') &&
                           secretKey.length > 20;

  if (!isValidSecretKey) {
    console.warn('WARNING: RECAPTCHA_SECRET_KEY not configured or is placeholder. Skipping verification for local testing.');
    return { success: true, skipped: true };
  }

  if (!token) {
    console.warn('WARNING: reCAPTCHA token missing from request. Skipping verification.');
    return { success: true, skipped: true };
  }

  try {
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: secretKey,
          response: token,
        },
      }
    );

    console.log('reCAPTCHA verification response:', response.data);

    if (response.data.success) {
      return { success: true, score: response.data.score };
    } else {
      return { 
        success: false, 
        error: 'reCAPTCHA verification failed',
        errorCodes: response.data['error-codes']
      };
    }
  } catch (error) {
    console.error('reCAPTCHA verification error:', error.message);
    return { success: false, error: 'reCAPTCHA verification request failed' };
  }
}

export const createDemoRequest = async (req, res) => {
  try {
    console.log('\n========== NEW DEMO REQUEST ==========');
    console.log('Request Body:', JSON.stringify(req.body, null, 2));

    // CRITICAL: Ensure MongoDB connection before processing
    console.log('Checking MongoDB connection...');
    const isConnected = await ensureConnection();
    
    if (!isConnected) {
      console.error('MongoDB connection failed after retry');
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
      recaptchaToken,
    } = req.body;

    // Verify reCAPTCHA token
    console.log('Verifying reCAPTCHA token...');
    const recaptchaResult = await verifyRecaptcha(recaptchaToken);
    
    if (!recaptchaResult.success) {
      console.error('reCAPTCHA verification failed:', recaptchaResult.error);
      return res.status(400).json({
        success: false,
        message: 'reCAPTCHA verification failed. Please try again.',
        error: recaptchaResult.error,
      });
    }

    if (recaptchaResult.skipped) {
      console.log('reCAPTCHA verification skipped (local testing mode)');
    } else {
      console.log('reCAPTCHA verified successfully');
      if (recaptchaResult.score !== undefined) {
        console.log('reCAPTCHA score:', recaptchaResult.score);
      }
    }

    // Log database connection state
    console.log('MongoDB connected');
    console.log('Connection State:', mongoose.connection.readyState, '(1 = connected)');
    console.log('Database:', mongoose.connection.db?.databaseName || 'not connected');
    console.log('Collection Name:', DemoRequest.collection.name);

    // Validate required fields
    const validationErrors = [];
    
    if (!fullName || !fullName.trim()) {
      validationErrors.push('Full name is required');
    } else if (fullName.trim().length < 2) {
      validationErrors.push('Full name must be at least 2 characters');
    }
    
    if (!email || !email.trim()) {
      validationErrors.push('Email is required');
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      validationErrors.push('Please provide a valid email address');
    }
    
    if (!phone || !phone.trim()) {
      validationErrors.push('Phone number is required');
    } else if (phone.replace(/\D/g, '').length < 7) {
      validationErrors.push('Phone number must be at least 7 digits');
    }
    
    if (!company || !company.trim()) {
      validationErrors.push('Company name is required');
    } else if (company.trim().length < 2) {
      validationErrors.push('Company name must be at least 2 characters');
    }
    
    if (!jobTitle || !jobTitle.trim()) {
      validationErrors.push('Job title is required');
    } else if (jobTitle.trim().length < 2) {
      validationErrors.push('Job title must be at least 2 characters');
    }
    
    if (!country || !country.trim()) {
      validationErrors.push('Country is required');
    }
    
    if (!companySize) {
      validationErrors.push('Company size is required');
    } else if (!['1-10', '11-50', '51-200', '201-500', '500+'].includes(companySize)) {
      validationErrors.push('Invalid company size');
    }
    
    if (acceptedKvkk !== true) {
      validationErrors.push('Privacy policy acceptance is required');
    }

    if (validationErrors.length > 0) {
      console.error('Validation failed:', validationErrors);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors,
      });
    }

    console.log('Validation passed - all required fields present');

    // Create new demo request
    console.log('Creating new DemoRequest document...');
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

    console.log('Document created (not saved yet)');

    // Save to database
    console.log('Saving to MongoDB...');
    const savedRequest = await demoRequest.save();

    console.log('\n========== SUCCESS ==========');
    console.log('Successfully saved to MongoDB');
    console.log('Document ID:', savedRequest._id);
    console.log('Email:', savedRequest.email);
    console.log('Full Name:', savedRequest.fullName);
    console.log('Phone:', savedRequest.phone);
    console.log('Company:', savedRequest.company);
    console.log('Job Title:', savedRequest.jobTitle);
    console.log('Country:', savedRequest.country);
    console.log('Company Size:', savedRequest.companySize);
    console.log('Interests:', savedRequest.interests);
    console.log('Created At:', savedRequest.createdAt);
    console.log('Collection:', DemoRequest.collection.name);
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
    console.error('\n========== ERROR ==========');
    console.error('Error Type:', error.name);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    console.error('========== ERROR END ==========\n');

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      console.error('Validation Errors:', messages);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages,
      });
    }

    // Handle MongoDB connection errors
    if (error.name === 'MongoNetworkError' || error.name === 'MongoServerError') {
      console.error('MongoDB Network Error - attempting reconnection');
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
    console.log('\n========== GET ALL DEMO REQUESTS ==========');
    
    // Ensure connection
    const isConnected = await ensureConnection();
    if (!isConnected) {
      return res.status(503).json({
        success: false,
        message: 'Database connection failed',
        data: [],
      });
    }

    console.log('MongoDB Connection State:', mongoose.connection.readyState);
    console.log('MongoDB Database:', mongoose.connection.db?.databaseName || 'not connected');

    const requests = await DemoRequest.find().sort({ createdAt: -1 });

    console.log(`Found ${requests.length} requests`);
    console.log('========== GET COMPLETE ==========\n');

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error('Error fetching demo requests:', error.message);

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

    console.log('\n========== GET DEMO REQUEST BY ID ==========');
    console.log('Request ID:', id);

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
      console.error('Request not found');
      return res.status(404).json({
        success: false,
        message: 'Demo request not found',
      });
    }

    console.log('Request found');
    console.log('========== GET BY ID COMPLETE ==========\n');

    return res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error('Error fetching demo request:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch demo request',
      error: error.message,
    });
  }
};
