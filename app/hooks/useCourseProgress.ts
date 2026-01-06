import { useEffect, useState } from "react";

export function useCourseProgress(
  dbUserId: number | null,
  courseId: string | string[],
  lessons: { id: number }[]
) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!dbUserId || lessons.length === 0) return;

    const resume = async () => {
      const res = await fetch(
        `/api/progress?userId=${dbUserId}&courseId=${courseId}`
      );
      const data = await res.json();

      if (!data.progress?.length) {
        setCurrentIndex(0);
        return;
      }

      const completed = new Set(
        data.progress
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((p: any) => p.completed)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((p: any) => p.lessonId)
      );

      const index = lessons.findIndex((l) => !completed.has(l.id));
      setCurrentIndex(index === -1 ? 0 : index);
    };

    resume();
  }, [dbUserId, lessons, courseId]);

  return { currentIndex, setCurrentIndex };
}
