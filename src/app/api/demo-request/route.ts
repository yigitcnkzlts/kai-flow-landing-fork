import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import DemoRequest from "@/lib/models/DemoRequest";

// ---------- reCAPTCHA verification ----------
async function verifyRecaptcha(
  token: string | undefined
): Promise<{ success: boolean; score?: number; error?: string; skipped?: boolean }> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  const isValidSecretKey =
    secretKey &&
    secretKey !== "your_recaptcha_secret_key_here" &&
    !secretKey.includes("your_") &&
    secretKey.length > 20;

  if (!isValidSecretKey) {
    console.warn("RECAPTCHA_SECRET_KEY not configured. Skipping verification.");
    return { success: true, skipped: true };
  }

  if (!token) {
    console.warn("reCAPTCHA token missing. Skipping verification.");
    return { success: true, skipped: true };
  }

  try {
    const params = new URLSearchParams({
      secret: secretKey,
      response: token,
    });

    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?${params.toString()}`,
      { method: "POST" }
    );

    const data = await response.json();
    console.log("reCAPTCHA verification response:", data);

    if (data.success) {
      return { success: true, score: data.score };
    }
    return {
      success: false,
      error: `reCAPTCHA verification failed: ${(data["error-codes"] || []).join(", ")}`,
    };
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return { success: false, error: "reCAPTCHA verification request failed" };
  }
}

// ---------- POST /api/demo-request ----------
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("\n========== NEW DEMO REQUEST ==========");

    // 1. Connect to MongoDB
    await connectDB();

    // 2. Verify reCAPTCHA
    const recaptchaResult = await verifyRecaptcha(body.recaptchaToken);
    if (!recaptchaResult.success) {
      return NextResponse.json(
        { success: false, message: "reCAPTCHA verification failed.", error: recaptchaResult.error },
        { status: 400 }
      );
    }

    // 3. Validate required fields
    const { fullName, email, phone, acceptedKvkk } = body;
    if (!fullName || !email || !phone || !acceptedKvkk) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: fullName, email, phone, acceptedKvkk",
        },
        { status: 400 }
      );
    }

    // 4. Create and save document
    const demoRequest = new DemoRequest({
      fullName,
      email,
      phone,
      company: body.company,
      jobTitle: body.jobTitle,
      message: body.message,
      country: body.country,
      companySize: body.companySize,
      interests: body.interests || [],
      acceptedKvkk,
      acceptedMarketing: body.acceptedMarketing || false,
    });

    const savedRequest = await demoRequest.save();
    console.log("Demo request saved:", savedRequest._id);
    console.log("========== REQUEST COMPLETE ==========\n");

    return NextResponse.json(
      {
        success: true,
        message: "Demo request received and saved successfully",
        data: {
          id: savedRequest._id,
          email: savedRequest.email,
          fullName: savedRequest.fullName,
          createdAt: savedRequest.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Demo request error:", error);

    if (error instanceof Error && error.name === "ValidationError") {
      const mongooseError = error as import("mongoose").Error.ValidationError;
      const messages = Object.values(mongooseError.errors).map((e) => e.message);
      return NextResponse.json(
        { success: false, message: "Validation error", errors: messages },
        { status: 400 }
      );
    }

    const message =
      error instanceof Error ? error.message : "Failed to create demo request";

    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
