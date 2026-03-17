import { NextRequest, NextResponse } from "next/server";

interface DemoRequest {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  country: string;
  phone: string;
  companyName: string;
  companySize: string;
  interests: string[];
  message: string;
  newsletter: boolean;
  privacyConsent: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: DemoRequest = await request.json();

    // Log the demo request
    const demoRequest = {
      id: `demo_${Date.now()}`,
      timestamp: new Date().toISOString(),
      firstName: body.firstName || "N/A",
      lastName: body.lastName || "N/A",
      email: body.email || "N/A",
      jobTitle: body.jobTitle || "N/A",
      country: body.country || "N/A",
      phone: body.phone || "N/A",
      companyName: body.companyName || "N/A",
      companySize: body.companySize || "N/A",
      interests: body.interests || [],
      message: body.message || "",
      newsletter: body.newsletter || false,
      privacyConsent: body.privacyConsent || false,
    };

    console.log("✅ Demo Request Received:", demoRequest);

    // TODO: Save to MongoDB when backend is ready
    // For now, just return success with the request data
    return NextResponse.json(
      {
        success: true,
        message: "Demo request received successfully",
        requestId: demoRequest.id,
        data: demoRequest,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error processing demo request:", error);
    return NextResponse.json(
      { error: "Failed to process demo request" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "Demo request endpoint - POST to submit a demo request" },
    { status: 200 }
  );
}
