import { db } from "@/config/db";
import { lessonsTable, progressTable } from "@/config/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId, lessonId, score, completed } = await req.json();

  const existing = await db
    .select()
    .from(progressTable)
    .where(
      and(
        eq(progressTable.userId, userId),
        eq(progressTable.lessonId, lessonId)
      )
    );

  if (existing.length > 0) {
    await db
      .update(progressTable)
      .set({
        score,
        completed,
        updatedAt: new Date(),
      })
      .where(eq(progressTable.id, existing[0].id));
  } else {
    await db.insert(progressTable).values({
      userId,
      lessonId,
      score,
      completed,
    });
  }

  return NextResponse.json({ success: true });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const courseId = searchParams.get("courseId");

  if (!userId || !courseId) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const progress = await db
    .select({
      lessonId: progressTable.lessonId,
      completed: progressTable.completed,
    })
    .from(progressTable)
    .innerJoin(lessonsTable, eq(progressTable.lessonId, lessonsTable.id))
    .where(eq(progressTable.userId, Number(userId)));

  return NextResponse.json({ progress });
}
