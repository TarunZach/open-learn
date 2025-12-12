import { db } from "@/config/db";
import {
  coursesTable,
  lessonsTable,
  quizzesTable,
  questionsTable,
} from "@/config/schema";
import { eq } from "drizzle-orm";
import { inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await context.params;
    const id = Number(courseId);

    if (!id) {
      return NextResponse.json(
        { error: "courseId is required" },
        { status: 400 }
      );
    }

    // 1. Get lessons for the course
    const lessons = await db
      .select()
      .from(lessonsTable)
      .where(eq(lessonsTable.courseId, id));

    const lessonIds = lessons.map((l) => l.id);

    if (lessonIds.length > 0) {
      // 2. Get quizzes for those lessons
      const quizzes = await db
        .select()
        .from(quizzesTable)
        .where(inArray(quizzesTable.lessonId, lessonIds));

      const quizIds = quizzes.map((q) => q.id);

      // 3. Delete questions associated with quizzes
      if (quizIds.length > 0) {
        await db
          .delete(questionsTable)
          .where(inArray(questionsTable.quizId, quizIds));
      }

      // 4. Delete quizzes for lessons
      await db
        .delete(quizzesTable)
        .where(inArray(quizzesTable.lessonId, lessonIds));
    }

    // 5. Delete lessons for the course
    await db.delete(lessonsTable).where(eq(lessonsTable.courseId, id));

    // 6. Delete the course
    await db.delete(coursesTable).where(eq(coursesTable.id, id));

    return NextResponse.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}
