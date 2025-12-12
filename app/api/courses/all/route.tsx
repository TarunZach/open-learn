import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all courses from the database
    const courses = await db.select().from(coursesTable);

    // Return the courses as a JSON response
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
