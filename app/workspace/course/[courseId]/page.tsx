"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FullCourseResponse, Question } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@clerk/nextjs";
import { LessonViewer } from "../LessonViewer";

type Lesson = {
  id: number;
  title: string;
  content: string;
};

export default function ViewCourse() {
  const router = useRouter();
  const { user } = useUser();
  const { courseId } = useParams();

  const [courseData, setCourseData] = useState<FullCourseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [dbUserId, setDbUserId] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [mode, setMode] = useState<"read" | "audio">("read");

  /* ---------------- USER ---------------- */
  useEffect(() => {
    if (!user) return;

    fetch("/api/user")
      .then((r) => r.json())
      .then((d) => setDbUserId(d.user.id));
  }, [user]);

  /* ---------------- COURSE ---------------- */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await fetch(`/api/courses?courseId=${courseId}`);
      const data = await res.json();
      setCourseData(data);
      setLoading(false);
    };

    load();
  }, [courseId]);

  const lessons: Lesson[] = useMemo(
    () => courseData?.lessons?.sort((a, b) => a.id - b.id) ?? [],
    [courseData]
  );

  /* ---------------- RESUME ---------------- */
  useEffect(() => {
    if (!dbUserId || lessons.length === 0) return;

    fetch(`/api/progress?userId=${dbUserId}&courseId=${courseId}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.progress?.length) return setCurrentIndex(0);

        const completed = new Set(
          d.progress
            .filter(
              (p: { completed: boolean; lessonId: number }) => p.completed
            )
            .map((p: { lessonId: number }) => p.lessonId)
        );

        const idx = lessons.findIndex((l) => !completed.has(l.id));
        setCurrentIndex(idx === -1 ? 0 : idx);
      });
  }, [dbUserId, lessons, courseId]);

  const currentLesson = lessons[currentIndex];

  const currentQuiz = useMemo(
    () =>
      courseData?.quizzes.find((q) => q.lessonId === currentLesson?.id) ?? null,
    [courseData, currentLesson]
  );

  const quizQuestions: Question[] = useMemo(
    () =>
      courseData?.questions.filter((q) => q.quizId === currentQuiz?.id) ?? [],
    [courseData, currentQuiz]
  );

  const progressValue = Math.round(((currentIndex + 1) / lessons.length) * 100);

  const quizAnswered =
    quizQuestions.length === 0 || quizQuestions.every((q) => answers[q.id]);

  const isLast = currentIndex === lessons.length - 1;

  const saveProgress = async () => {
    if (!dbUserId || !currentLesson) return;

    const score = quizQuestions.reduce(
      (acc, q) => acc + (answers[q.id] === q.correctAnswer ? 1 : 0),
      0
    );

    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: dbUserId,
        lessonId: currentLesson.id,
        completed: 1,
        score,
      }),
    });
  };

  const next = async () => {
    await saveProgress();
    if (isLast) router.push("/workspace");
    else setCurrentIndex((i) => i + 1);
  };

  if (loading) return <div className="p-5">Loading…</div>;
  if (!currentLesson) return <div className="p-5">Not found</div>;

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{courseData?.course.title}</h1>

      {/* MODE SWITCH */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode("read")}
          className={`px-3 py-1 rounded ${
            mode === "read" ? "bg-black text-white" : "bg-gray-200"
          }`}
        >
          Read
        </button>
        <button
          onClick={() => setMode("audio")}
          className={`px-3 py-1 rounded ${
            mode === "audio" ? "bg-black text-white" : "bg-gray-200"
          }`}
        >
          Audio
        </button>
      </div>

      <Progress value={progressValue} />
      <p className="text-sm mt-1">{progressValue}% completed</p>

      <LessonViewer
        lesson={currentLesson}
        mode={mode}
        quiz={currentQuiz}
        questions={quizQuestions}
        answers={answers}
        onAnswer={(id, opt) => setAnswers((a) => ({ ...a, [id]: opt }))}
      />

      <div className="flex justify-between mt-6">
        <button
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Previous
        </button>

        <button
          onClick={next}
          disabled={mode === "read" && !quizAnswered}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isLast ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}
