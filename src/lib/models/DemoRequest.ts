import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDemoRequest extends Document {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  jobTitle?: string;
  message?: string;
  country?: string;
  companySize?: string;
  interests: string[];
  acceptedKvkk: boolean;
  acceptedMarketing: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const demoRequestSchema = new Schema<IDemoRequest>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Full name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    jobTitle: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    companySize: {
      type: String,
      enum: ["1-10", "11-50", "51-200", "201-500", "500+", ""],
      default: "",
    },
    interests: {
      type: [String],
      default: [],
    },
    acceptedKvkk: {
      type: Boolean,
      required: [true, "KVKK acceptance is required"],
    },
    acceptedMarketing: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in dev (hot-reload)
const DemoRequest: Model<IDemoRequest> =
  mongoose.models.DemoRequest ||
  mongoose.model<IDemoRequest>("DemoRequest", demoRequestSchema);

export default DemoRequest;
