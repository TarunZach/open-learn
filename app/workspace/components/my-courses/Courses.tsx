"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Course } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import AddCourse from "../AddCourse";

const Courses = () => {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedCourses, setCompletedCourses] = useState<number[]>([]);
  const [dbUserId, setDbUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/courses/all");
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchCompleted = async () => {
      const res = await fetch("/api/user");
      const userData = await res.json();

      const dbId = userData.user.id;
      setDbUserId(dbId);

      const progressRes = await fetch(
        `/api/progress/completed-courses?userId=${dbId}`
      );
      const progressData = await progressRes.json();

      setCompletedCourses(progressData.completedCourses);
    };

    fetchCompleted();

    fetchCourses();
  }, []);

  const handleDelete = async (courseId: number) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this course?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Course deleted successfully");
        setCourses((prev) => prev!.filter((c) => c.id !== courseId));
        return;
      } else {
        const errorData = await res.json();
        alert(`Failed to delete course: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("An error occurred while deleting the course.");
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!courses || courses.length === 0) {
    return (
      <div className="flex p-7 items-center justify-center flex-col border rounded-xl mt-2 bg-secondary gap-3">
        <Image src={"/book.svg"} width={35} height={35} alt="book" />
        <h2 className="my-2 text-xl font-bold">
          No Courses Created or Available
        </h2>
        <AddCourse>
          <Button>Create your course</Button>
        </AddCourse>
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((course) => (
          <div
            key={course.id}
            className="p-5 border rounded-lg shadow hover:shadow-lg transition flex flex-col w-100"
          >
            {completedCourses.includes(course.id) && (
              <span className="inline-block mb-2 text-xs px-2 py-1 bg-green-600 text-white rounded">
                Completed
              </span>
            )}
            <h2 className="text-xl font-bold">{course.title}</h2>
            <p className="text-gray-600">{course.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              Category: {course.category}
            </p>

            <div className="flex gap-2 items-center justify-between mt-auto pt-4">
              {completedCourses.includes(course.id) ? (
                <Button
                  variant="outline"
                  className="mt-3"
                  disabled={!dbUserId}
                  onClick={async () => {
                    if (!dbUserId) return;

                    await fetch("/api/progress/reset", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        userId: dbUserId,
                        courseId: course.id,
                      }),
                    });

                    setCompletedCourses((prev) =>
                      prev.filter((id) => id !== course.id)
                    );

                    window.location.href = `/workspace/course/${course.id}`;
                  }}
                >
                  Restart
                </Button>
              ) : (
                <Button className="mt-3">
                  <Link href={`/workspace/course/${course.id}`}>
                    View Course
                  </Link>
                </Button>
              )}

              <Button className="mt-3">
                <Link href={`/workspace/edit-course/${course.id}`}>
                  Edit Course
                </Link>
              </Button>
              <Button
                className="bg-red-500 text-white mt-3"
                onClick={() => handleDelete(course.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
