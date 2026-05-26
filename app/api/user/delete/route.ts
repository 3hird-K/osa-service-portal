import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE() {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const client = await clerkClient();
    await client.users.deleteUser(userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
