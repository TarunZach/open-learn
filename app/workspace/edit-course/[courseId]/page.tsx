"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FullCourseResponse } from "@/lib/types";
import CourseInfo from "../components/CourseInfo";
import TopicList from "../components/TopicList";

const EditCourse = () => {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState<FullCourseResponse | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      const res = await fetch(`/api/courses?courseId=${courseId}`);
      const data = (await res.json()) as FullCourseResponse;
      setCourseData(data);
      setLoading(false);
    };

    fetchCourse();
  }, [courseId]);

  if (loading) return <div>Loading...</div>;
  if (!courseData) return <div>Course not found</div>;

  return (
    <div className="p-5">
      <CourseInfo course={courseData.course} />
      <TopicList course={courseData} />
    </div>
  );
};

export default EditCourse;
