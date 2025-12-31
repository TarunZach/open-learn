import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export const GET = async () => {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.clerkUserId, userId));

  if (existing.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user: existing[0] });
};

export const POST = async () => {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.clerkUserId, userId));

  if (existing.length > 0) {
    return NextResponse.json({
      created: false,
      user: existing[0],
    });
  }

  const clerk = await clerkClient();
  const clerkUser = await clerk.users.getUser(userId);

  const email = clerkUser.emailAddresses?.[0]?.emailAddress;
  const name = clerkUser.firstName || clerkUser.username || "User";

  if (!email) {
    return NextResponse.json({ error: "Email not found" }, { status: 400 });
  }

  const result = await db
    .insert(usersTable)
    .values({
      clerkUserId: userId,
      name,
      email,
    })
    .returning();

  return NextResponse.json({
    created: true,
    user: result[0],
  });
};
