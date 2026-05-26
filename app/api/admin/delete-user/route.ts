import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const { userId: adminId, isAuthenticated } = await auth();

  if (!isAuthenticated || !adminId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { targetUserId } = await req.json();

  if (!targetUserId) {
    return NextResponse.json({ error: "targetUserId is required" }, { status: 400 });
  }

  if (targetUserId === adminId) {
    return NextResponse.json({ error: "Cannot delete your own account from here" }, { status: 400 });
  }

  try {
    const client = await clerkClient();

    // Verify admin role in your DB before allowing deletion
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://server-osa-service.onrender.com";
    const adminProfileRes = await fetch(`${apiUrl}/profiles/${adminId}`);
    if (!adminProfileRes.ok) {
      return NextResponse.json({ error: "Could not verify admin permissions" }, { status: 403 });
    }
    const adminProfile = await adminProfileRes.json();
    if (adminProfile.account_type?.toLowerCase() !== "admin") {
      return NextResponse.json({ error: "Only admins can delete users" }, { status: 403 });
    }

    // Delete from Clerk
    await client.users.deleteUser(targetUserId);

    // Delete from your DB
    await fetch(`${apiUrl}/profiles/${targetUserId}`, { method: "DELETE" });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin delete error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
