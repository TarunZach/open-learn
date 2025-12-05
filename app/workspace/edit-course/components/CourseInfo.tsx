import { CourseFormData } from "@/lib/types";
// import { Clock } from "lucide-react";

const CourseInfo = ({ course }: { course: CourseFormData }) => {
  return (
    <div>
      <div>
        <h2 className="font-bold text-2xl">{course?.title}</h2>
        <p className="line-clamp-2">{course?.description}</p>
        {/* TODO: Add Timeline or estimate */}
        {/* <div>
          <div>
            <Clock />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default CourseInfo;
