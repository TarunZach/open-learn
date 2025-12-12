"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FullCourseResponse, Question } from "@/lib/types";

type LessonContentItem = {
  type: "lesson";
  title: string;
  content: string;
};

type QuizContentItem = {
  type: "quiz";
  title: string;
  questions: Question[];
};

type ContentItem = LessonContentItem | QuizContentItem;

const ViewCourse = () => {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState<FullCourseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/courses?courseId=${courseId}`);
        const data = await res.json();
        setCourseData(data);
      } catch (error) {
        console.error("Failed to fetch course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) return <div>Loading...</div>;
  if (!courseData) return <div>Course not found</div>;

  const content: ContentItem[] = [
    ...courseData.lessons.map(
      (lesson) =>
        ({
          type: "lesson",
          title: lesson.title,
          content: lesson.content,
        } as const)
    ),
    ...courseData.quizzes.map(
      (quiz) =>
        ({
          type: "quiz",
          title: quiz.title,
          questions: courseData.questions.filter(
            (question) => question.quizId === quiz.id
          ),
        } as const)
    ),
  ];

  const handleNext = () => {
    if (currentIndex < content.length - 1) {
      setSelectedAnswer(null);
      setIsCorrect(null);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setSelectedAnswer(null);
      setIsCorrect(null);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleAnswerSelection = (selected: string, correctAnswer: string) => {
    setSelectedAnswer(selected);
    setIsCorrect(selected === correctAnswer);
  };

  const renderContent = () => {
    const currentItem = content[currentIndex];

    if (currentItem.type === "lesson") {
      return (
        <div>
          <h2 className="text-xl font-bold">{currentItem.title}</h2>
          <p className="mt-3">{currentItem.content}</p>
        </div>
      );
    }

    if (currentItem.type === "quiz") {
      return (
        <div>
          <h2 className="text-xl font-bold">{currentItem.title}</h2>
          {currentItem.questions.map((q) => (
            <div key={q.id} className="mt-5">
              <p className="font-semibold">{q.questionText}</p>
              <div className="mt-3">
                {["A", "B", "C", "D"].map((option) => (
                  <label
                    key={option}
                    className={`block p-2 border rounded-lg cursor-pointer ${
                      selectedAnswer === option
                        ? isCorrect
                          ? "bg-green-200"
                          : "bg-red-200"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={option}
                      className="mr-2"
                      onChange={() =>
                        handleAnswerSelection(option, q.correctAnswer)
                      }
                      disabled={selectedAnswer !== null}
                    />
                    {q[`option${option}` as keyof Question]}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">{courseData.course.title}</h1>
      <div className="p-5 border rounded-lg shadow">{renderContent()}</div>
      <div className="flex justify-between mt-5">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === content.length - 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ViewCourse;
