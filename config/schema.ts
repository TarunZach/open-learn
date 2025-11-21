import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const courseCategory = pgEnum("course_category", [
  "programming",
  "ai",
  "business",
  "health",
  "science",
  "productivity",
  "language",
]);

export const courseLevel = pgEnum("course_level", [
  "beginner",
  "intermediate",
  "advanced",
]);

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export const lessonsTable = pgTable("lessons", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  courseId: integer("course_id")
    .notNull()
    .references(() => coursesTable.id),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  language: varchar("language", { length: 50 }).default("en"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const coursesTable = pgTable("courses", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  audioUrl: varchar("audio_url", { length: 500 }).default(""),
  transcript: text("transcript"),
  category: courseCategory("category").notNull(),
  level: courseLevel("level").notNull(),
  topics: integer("topics").notNull().default(3),
  createdBy: integer("created_by").references(() => usersTable.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const quizzesTable = pgTable("quizzes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  lessonId: integer("lesson_id")
    .notNull()
    .references(() => lessonsTable.id),
  title: varchar("title", { length: 255 }).notNull(),
});

export const questionsTable = pgTable("questions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  quizId: integer("quiz_id")
    .notNull()
    .references(() => quizzesTable.id),
  questionText: text("question_text").notNull(),
  optionA: varchar("option_a", { length: 255 }).notNull(),
  optionB: varchar("option_b", { length: 255 }).notNull(),
  optionC: varchar("option_c", { length: 255 }).notNull(),
  optionD: varchar("option_d", { length: 255 }).notNull(),
  correctAnswer: varchar("correct_answer", { length: 255 }).notNull(),
});

export const progressTable = pgTable("progress", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .references(() => usersTable.id)
    .notNull(),
  lessonId: integer("lesson_id")
    .references(() => lessonsTable.id)
    .notNull(),
  score: integer("score").default(0),
  completed: integer("completed").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});
