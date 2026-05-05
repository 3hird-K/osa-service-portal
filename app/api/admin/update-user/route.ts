import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId: adminId, isAuthenticated } = await auth();

  if (!isAuthenticated || !adminId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { targetUserId, firstName, lastName, account_type } = await req.json();

  if (!targetUserId) {
    return NextResponse.json({ error: "targetUserId is required" }, { status: 400 });
  }

  try {
    const client = await clerkClient();

    // Update name via Clerk
    await client.users.updateUser(targetUserId, {
      firstName,
      lastName,
    });

    // Update account_type in your own DB via FastAPI
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://server-osa-service.onrender.com";
    const dbRes = await fetch(`${apiUrl}/profiles/${targetUserId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstname: firstName, lastname: lastName, account_type }),
    });

    if (!dbRes.ok) {
      const err = await dbRes.json().catch(() => ({}));
      return NextResponse.json({ error: err.detail ?? "DB update failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin update error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
