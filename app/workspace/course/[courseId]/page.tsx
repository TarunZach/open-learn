"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FullCourseResponse, Question } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@clerk/nextjs";

type Lesson = {
  id: number;
  title: string;
  content: string;
};

const ViewCourse = () => {
  const router = useRouter();
  const { user } = useUser();
  const { courseId } = useParams();

  const [courseData, setCourseData] = useState<FullCourseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [dbUserId, setDbUserId] = useState<number | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!user) return;

    const fetchDbUser = async () => {
      const res = await fetch("/api/user", { method: "GET" });
      const data = await res.json();
      setDbUserId(data.user.id);
    };

    fetchDbUser();
  }, [user]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/courses?courseId=${courseId}`);
        const data = await res.json();
        setCourseData(data);
      } catch (err) {
        console.error("Failed to fetch course", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const lessons: Lesson[] = useMemo(() => {
    if (!courseData) return [];
    return [...courseData.lessons].sort((a, b) => a.id - b.id);
  }, [courseData]);

  useEffect(() => {
    if (!dbUserId || lessons.length === 0) return;

    const resumeProgress = async () => {
      const res = await fetch(
        `/api/progress?userId=${dbUserId}&courseId=${courseId}`
      );
      const data = await res.json();

      if (!data.progress || data.progress.length === 0) {
        setCurrentIndex(0);
        return;
      }

      const completedLessons = new Set(
        data.progress
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((p: any) => p.completed === 1)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((p: any) => p.lessonId)
      );

      const resumeIndex = lessons.findIndex(
        (lesson) => !completedLessons.has(lesson.id)
      );

      setCurrentIndex(resumeIndex === -1 ? 0 : resumeIndex);
    };

    resumeProgress();
  }, [dbUserId, lessons, courseId]);

  const currentLesson = lessons[currentIndex];

  const currentQuiz = useMemo(() => {
    if (!courseData || !currentLesson) return null;

    return courseData.quizzes.find(
      (quiz) => quiz.lessonId === currentLesson.id
    );
  }, [courseData, currentLesson]);

  const quizQuestions: Question[] = useMemo(() => {
    if (!courseData || !currentQuiz) return [];

    return courseData.questions.filter((q) => q.quizId === currentQuiz.id);
  }, [courseData, currentQuiz]);

  const progressValue = useMemo(() => {
    if (lessons.length === 0) return 0;
    return Math.round(((currentIndex + 1) / lessons.length) * 100);
  }, [currentIndex, lessons.length]);

  const quizAnswered =
    quizQuestions.length === 0 ||
    quizQuestions.every((q) => answers[q.id] !== undefined);

  const isLastLesson = currentIndex === lessons.length - 1;

  const saveProgress = async () => {
    if (!currentLesson || !dbUserId) return;

    const score =
      quizQuestions.length === 0
        ? 0
        : quizQuestions.reduce(
            (acc, q) => acc + (answers[q.id] === q.correctAnswer ? 1 : 0),
            0
          );

    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: dbUserId, // ✅ INTEGER
        lessonId: currentLesson.id,
        completed: 1,
        score,
      }),
    });
  };

  const handleNext = async () => {
    await saveProgress();

    if (!isLastLesson) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      console.log("Course completed");
      router.push(`/workspace`);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleAnswerSelection = (questionId: number, selected: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selected,
    }));
  };

  if (loading) return <div className="p-5">Loading...</div>;
  if (!courseData || !currentLesson)
    return <div className="p-5">Course not found</div>;

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{courseData.course.title}</h1>

      <div className="mb-6">
        <Progress value={progressValue} />
        <p className="text-sm text-gray-600 mt-1">{progressValue}% completed</p>
      </div>

      <div className="p-5 border rounded-lg shadow">
        <h2 className="text-xl font-bold">{currentLesson.title}</h2>
        <p className="mt-3">{currentLesson.content}</p>

        {currentQuiz && quizQuestions.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold">{currentQuiz.title}</h3>

            {quizQuestions.map((q) => (
              <div key={q.id} className="mt-5">
                <p className="font-semibold">{q.questionText}</p>

                <div className="mt-3 flex flex-col gap-3">
                  {["A", "B", "C", "D"].map((option) => {
                    const selected = answers[q.id];
                    const hasAnswered = selected !== undefined;
                    const isSelected = selected === option;
                    const isCorrectOption = option === q.correctAnswer;

                    return (
                      <label
                        key={option}
                        className={`block p-2 border rounded-lg cursor-pointer
                          ${
                            hasAnswered && isCorrectOption ? "bg-green-200" : ""
                          }
                          ${isSelected && !isCorrectOption ? "bg-red-200" : ""}
                        `}
                      >
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          value={option}
                          className="mr-2"
                          checked={isSelected}
                          onChange={() => handleAnswerSelection(q.id, option)}
                          disabled={hasAnswered}
                        />
                        {q[`option${option}` as keyof Question]}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={!quizAnswered || !dbUserId}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {isLastLesson ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default ViewCourse;
