import { useEffect, useMemo, useState } from "react";
import { FullCourseResponse } from "@/lib/types";

export function useCourseData(courseId: string | string[]) {
  const [courseData, setCourseData] = useState<FullCourseResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      setLoading(true);
      const res = await fetch(`/api/courses?courseId=${courseId}`);
      const data = await res.json();
      setCourseData(data);
      setLoading(false);
    };

    fetchCourse();
  }, [courseId]);

  const lessons = useMemo(() => {
    if (!courseData) return [];
    return [...courseData.lessons].sort((a, b) => a.id - b.id);
  }, [courseData]);

  return { courseData, lessons, loading };
}
