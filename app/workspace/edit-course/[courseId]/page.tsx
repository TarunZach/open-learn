"use client";
import { LoadingSpinner } from "@/app/resuable/components/LoadingSpinner";
import { CourseFormData } from "@/lib/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CourseInfo from "../components/CourseInfo";

const EditCourse = () => {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState<CourseFormData>();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/courses?courseId=${courseId}`);
        const data = await res.json();
        setCourse(data);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  return loading ? (
    <div className="flex items-center justify-center">
      <LoadingSpinner />{" "}
    </div>
  ) : (
    <CourseInfo course={course!} />
  );
};

export default EditCourse;
