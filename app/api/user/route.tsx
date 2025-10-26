import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { name, email } = await req.json();

  // User already exists?
  const users = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  // New user
  if (users?.length === 0) {
    const result = await db
      .insert(usersTable)
      .values({
        name,
        email,
      })
      .returning();
    return NextResponse.json({
      message: "User created successfully!",
      user: result[0],
    });
  }
  return NextResponse.json({ message: "User already exists!", user: users[0] });
};
