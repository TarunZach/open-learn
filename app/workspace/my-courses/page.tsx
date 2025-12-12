"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Course } from "@/lib/types";
import { Button } from "@/components/ui/button";

const MyCourses = () => {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold">No Courses Available</h2>
        <p className="text-gray-500">
          {`You haven't enrolled in any courses yet.`}
        </p>
      </div>
    );
  }

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">My Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((course) => (
          <div
            key={course.id}
            className="p-5 border rounded-lg shadow hover:shadow-lg transition flex flex-col"
          >
            <h2 className="text-xl font-bold">{course.title}</h2>
            <p className="text-gray-600">{course.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              Category: {course.category}
            </p>

            {/* Pushes this section to bottom */}
            <div className="flex gap-2 items-center justify-between mt-auto pt-4">
              <Button className="mt-3">
                <Link href={`/workspace/course/${course.id}`}>View Course</Link>
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

export default MyCourses;
