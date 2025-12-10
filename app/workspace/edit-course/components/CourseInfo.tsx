import { Button } from "@/components/ui/button";
import { CourseFormData } from "@/lib/types";
import { Book, Settings, TrendingUp } from "lucide-react";

const CourseInfo = ({ course }: { course: CourseFormData }) => {
  return (
    <div className="flex gap-5 justify-between p-5 rounded-2xl shadow">
      <div className="flex flex-col gap-3 w-full">
        <h2 className="font-bold text-3xl">{course?.title}</h2>
        <p className="line-clamp-2 text-gray-500">{course?.description}</p>
        {/* TODO: Add Timeline or estimate */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex gap-5 items-center p-3 rounded-lg shadow">
            <Book className="text-green-500" />
            <section>
              <h2 className="font-bold">No. of Chapters</h2>
              <h2>{course?.topics}</h2>
            </section>
          </div>
          <div className="flex gap-5 items-center p-3 rounded-lg shadow">
            <TrendingUp className="text-red-500" />
            <section>
              <h2 className="font-bold">Difficulty</h2>
              <h2>{course?.level}</h2>
            </section>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Button className="max-w-sm">
            <Settings />
            Generate Content
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseInfo;
