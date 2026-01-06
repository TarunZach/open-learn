"use client";

import { useEffect, useState } from "react";
import { Question } from "@/lib/types";

type Lesson = {
  id: number;
  title: string;
  content: string;
};

type LessonViewerProps = {
  lesson: Lesson;
  mode: "read" | "audio";
  quiz: { title: string } | null;
  questions: Question[];
  answers: Record<number, string>;
  onAnswer: (questionId: number, option: string) => void;
};

export function LessonViewer({
  lesson,
  mode,
  quiz,
  questions,
  answers,
  onAnswer,
}: LessonViewerProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const playAudio = async () => {
    try {
      setLoadingAudio(true);
      setError(null);

      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: lesson.content,
        }),
      });

      if (!res.ok) {
        throw new Error("Audio generation failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setAudioUrl(url);
    } catch (err) {
      console.error(err);
      setError("Unable to generate audio.");
    } finally {
      setLoadingAudio(false);
    }
  };

  /**
   * 🔥 AUTO-PLAY LOGIC
   * Runs when:
   * - lesson changes
   * - mode switches to audio
   */
  useEffect(() => {
    // Cleanup previous audio
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

    if (mode === "audio") {
      playAudio();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id, mode]);

  return (
    <div className="p-5 border rounded-lg shadow">
      <h2 className="text-xl font-bold">{lesson.title}</h2>

      {/* 📖 READ MODE */}
      {mode === "read" && (
        <p className="mt-3 whitespace-pre-line">{lesson.content}</p>
      )}

      {mode === "audio" && (
        <>
          {loadingAudio && (
            <p className="mt-4 text-sm text-gray-500">Generating audio…</p>
          )}

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

          {audioUrl && (
            <audio
              key={lesson.id} // 👈 forces reload on lesson change
              controls
              autoPlay
              className="mt-4 w-full"
              src={audioUrl}
            />
          )}
        </>
      )}

      {mode === "read" && quiz && questions.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold">{quiz.title}</h3>

          {questions.map((q) => (
            <div key={q.id} className="mt-5 flex flex-col gap-2">
              <p className="font-semibold">{q.questionText}</p>

              {["A", "B", "C", "D"].map((opt) => {
                const selected = answers[q.id];
                const isCorrect = opt === q.correctAnswer;

                return (
                  <label
                    key={opt}
                    className={`flex gap-1 p-2 border rounded-lg cursor-pointer
                      ${
                        selected && (isCorrect ? "bg-green-200" : "bg-red-200")
                      }`}
                  >
                    <input
                      type="radio"
                      checked={selected === opt}
                      onChange={() => onAnswer(q.id, opt)}
                      disabled={!!selected}
                    />
                    {q[`option${opt}` as keyof Question]}
                  </label>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
