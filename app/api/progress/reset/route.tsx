// app/api/progress/reset/route.ts
import { db } from "@/config/db";
import { progressTable, lessonsTable } from "@/config/schema";
import { eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId, courseId } = await req.json();

  if (!userId || !courseId) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const lessons = await db
    .select({ id: lessonsTable.id })
    .from(lessonsTable)
    .where(eq(lessonsTable.courseId, courseId));

  const lessonIds = lessons.map((l) => l.id);

  if (lessonIds.length === 0) {
    return NextResponse.json({ success: true });
  }

  await db
    .delete(progressTable)
    .where(inArray(progressTable.lessonId, lessonIds));

  return NextResponse.json({ success: true });
}
