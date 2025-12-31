import { db } from "@/config/db";
import { progressTable, lessonsTable } from "@/config/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = Number(searchParams.get("userId"));

  if (Number.isNaN(userId)) {
    return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
  }

  const rows = await db
    .select({
      lessonId: lessonsTable.id,
      courseId: lessonsTable.courseId,
      completed: progressTable.completed,
    })
    .from(lessonsTable)
    .leftJoin(
      progressTable,
      and(
        eq(progressTable.lessonId, lessonsTable.id),
        eq(progressTable.userId, userId)
      )
    );

  const courseMap = new Map<number, { total: number; done: number }>();

  rows.forEach((r) => {
    if (!courseMap.has(r.courseId)) {
      courseMap.set(r.courseId, { total: 0, done: 0 });
    }

    const entry = courseMap.get(r.courseId)!;
    entry.total += 1;
    if (r.completed === 1) entry.done += 1;
  });

  const completedCourses = Array.from(courseMap.entries())
    .filter(([, v]) => v.total === v.done)
    .map(([courseId]) => courseId);

  return NextResponse.json({ completedCourses });
}
