import { db } from "@/config/db";
import {
  coursesTable,
  lessonsTable,
  questionsTable,
  quizzesTable,
} from "@/config/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { title, description, category, level, topics, transcript } = body;

    const coursePrompt = `
Generate a complete micro-learning course structure in valid JSON format.

You are given course metadata and an optional transcript. If a transcript or description is provided, USE IT to generate lessons, explanations, and quiz questions. If the transcript is null, generate content based on general knowledge of the topic. The difficulty level also should be considered when generating the course.

Return ONLY the JSON — no commentary.

=========================================
INPUT
=========================================

{
  "title": "${title}",
  "description": "${description}",
  "category": "${category}",
  "level": "${level}",
  "topics": ${topics},
  "transcript": ${JSON.stringify(transcript || "")}
}

=========================================
OUTPUT SCHEMA
=========================================

{
  "topics": [
    {
      "topicTitle": "string",
      "lessons": [
        {
          "title": "string",
          "content": "string",
          "language": "en"
        }
      ],
      "quiz": {
        "lessonIndex": number,
        "title": "string",
        "questions": [
          {
            "questionText": "string",
            "optionA": "string",
            "optionB": "string",
            "optionC": "string",
            "optionD": "string",
            "correctAnswer": "A | B | C | D"
          }
        ]
      }
    }
  ]
}

=========================================
RULES
=========================================

- Generate EXACTLY ${topics} topics.
- Each topic must contain 2–4 lessons.
- Lessons MUST be based on the transcript if available.
- Only ONE quiz per topic.
- Each quiz MUST be tied to a specific lesson using the "lessonIndex" property (0-based index).
- Quiz must contain 3–5 MCQs.
- Use "en" as language.
- Return ONLY valid JSON.
`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b:free",
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "courseStructure",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  topics: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        topicTitle: { type: "string" },
                        lessons: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              title: { type: "string" },
                              content: { type: "string" },
                              language: { type: "string" },
                            },
                            required: ["title", "content", "language"],
                            additionalProperties: false,
                          },
                        },
                        quiz: {
                          type: "object",
                          properties: {
                            lessonIndex: { type: "number" },
                            title: { type: "string" },
                            questions: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  questionText: { type: "string" },
                                  optionA: { type: "string" },
                                  optionB: { type: "string" },
                                  optionC: { type: "string" },
                                  optionD: { type: "string" },
                                  correctAnswer: {
                                    type: "string",
                                    enum: ["A", "B", "C", "D"],
                                  },
                                },
                                required: [
                                  "questionText",
                                  "optionA",
                                  "optionB",
                                  "optionC",
                                  "optionD",
                                  "correctAnswer",
                                ],
                                additionalProperties: false,
                              },
                            },
                          },
                          required: ["lessonIndex", "title", "questions"],
                          additionalProperties: false,
                        },
                      },
                      required: ["topicTitle", "lessons", "quiz"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["topics"],
                additionalProperties: false,
              },
            },
          },
          messages: [{ role: "user", content: coursePrompt }],
        }),
      }
    );

    const result = await response.json();

    const structuredString = result.choices[0].message.content;

    let structuredJson;
    try {
      structuredJson = JSON.parse(structuredString);
    } catch (e: Error | any) {
      console.error("Failed to parse JSON:", structuredString);
      throw new Error("Model returned invalid JSON", e.message);
    }

    const [newCourse] = await db
      .insert(coursesTable)
      .values({
        title,
        description,
        category,
        level,
        topics,
        transcript: transcript || "",
      })
      .returning();

    const courseId = newCourse.id;

    for (const topic of structuredJson.topics) {
      for (let i = 0; i < topic.lessons.length; i++) {
        const lesson = topic.lessons[i];

        // Insert lesson for this course
        const [newLesson] = await db
          .insert(lessonsTable)
          .values({
            courseId,
            title: lesson.title,
            content: lesson.content,
            language: "en",
          })
          .returning();

        const lessonId = newLesson.id;

        // Insert quiz if the lessonIndex matches the current lesson
        if (topic.quiz.lessonIndex === i) {
          const [newQuiz] = await db
            .insert(quizzesTable)
            .values({
              lessonId,
              title: topic.quiz.title,
            })
            .returning();

          const quizId = newQuiz.id;

          // Insert questions for this quiz
          for (const q of topic.quiz.questions) {
            await db.insert(questionsTable).values({
              quizId,
              questionText: q.questionText,
              optionA: q.optionA,
              optionB: q.optionB,
              optionC: q.optionC,
              optionD: q.optionD,
              correctAnswer: q.correctAnswer,
            });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      courseId,
      course: newCourse.title,
    });
  } catch (err) {
    console.error("Course generation error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to generate course" }),
      {
        status: 500,
      }
    );
  }
}
