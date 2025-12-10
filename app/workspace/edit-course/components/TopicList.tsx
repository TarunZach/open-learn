import { FullCourseResponse } from "@/lib/types";

const TopicList = ({ course }: { course: FullCourseResponse }) => {
  return (
    <div>
      <h2 className="font-bold text-3xl mt-10">Chapters & Topics</h2>

      <div className="mt-5 flex flex-col gap-5">
        {course.lessons.map((lesson) => (
          <div key={lesson.id} className="p-4 border rounded-lg shadow">
            <h3 className="text-xl font-semibold">{lesson.title}</h3>
            <p className="text-gray-600">{lesson.content}</p>

            {course.quizzes
              .filter((q) => q.lessonId === lesson.id)
              .map((q) => (
                <div key={q.id} className="mt-3 p-3 rounded border">
                  <h4 className="font-bold">{q.title}</h4>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicList;
