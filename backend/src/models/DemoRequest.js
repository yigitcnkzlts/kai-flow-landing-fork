import mongoose from 'mongoose';

const demoRequestSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      validate: {
        validator: function(v) {
          return v.replace(/\D/g, '').length >= 7;
        },
        message: 'Phone number must be at least 7 digits'
      }
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      minlength: [2, 'Company name must be at least 2 characters'],
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      minlength: [2, 'Job title must be at least 2 characters'],
    },
    message: {
      type: String,
      trim: true,
      default: '',
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    companySize: {
      type: String,
      required: [true, 'Company size is required'],
      enum: {
        values: ['1-10', '11-50', '51-200', '201-500', '500+'],
        message: 'Invalid company size'
      },
    },
    interests: {
      type: [String],
      default: [],
    },
    acceptedKvkk: {
      type: Boolean,
      required: [true, 'Privacy policy acceptance is required'],
      validate: {
        validator: function(v) {
          return v === true;
        },
        message: 'Privacy policy must be accepted'
      }
    },
    acceptedMarketing: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const DemoRequest = mongoose.model('DemoRequest', demoRequestSchema);

export default DemoRequest;
