CREATE TYPE "public"."course_category" AS ENUM('programming', 'ai', 'business', 'health', 'science', 'productivity', 'language');--> statement-breakpoint
CREATE TYPE "public"."course_level" AS ENUM('beginner', 'intermediate', 'advanced');--> statement-breakpoint
CREATE TABLE "courses" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "courses_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(255) NOT NULL,
	"description" text,
	"audio_url" varchar(500) DEFAULT '',
	"transcript" text,
	"category" "course_category" NOT NULL,
	"level" "course_level" NOT NULL,
	"topics" integer DEFAULT 3 NOT NULL,
	"created_by" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "lessons" DROP CONSTRAINT "lessons_created_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "lessons" ADD COLUMN "course_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "clerk_user_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessons" DROP COLUMN "created_by";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_clerk_user_id_unique" UNIQUE("clerk_user_id");