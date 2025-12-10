import { db } from "@/config/db";
import {
  coursesTable,
  lessonsTable,
  quizzesTable,
  questionsTable,
} from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const courseId = Number(searchParams.get("courseId"));

  if (!courseId) {
    return NextResponse.json({ error: "courseId required" }, { status: 400 });
  }

  const course = await db
    .select()
    .from(coursesTable)
    .where(eq(coursesTable.id, courseId));

  if (!course[0]) return NextResponse.json(null);

  const lessons = await db
    .select()
    .from(lessonsTable)
    .where(eq(lessonsTable.courseId, courseId));

  const quizzes = await db.select().from(quizzesTable);

  const questions = await db.select().from(questionsTable);

  return NextResponse.json({
    course: course[0],
    lessons,
    quizzes,
    questions,
  });
}
