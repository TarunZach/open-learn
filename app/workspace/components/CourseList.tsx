"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import AddCourse from "./AddCourse";

const CourseList = () => {
  const [course, setCourse] = useState([]);

  return (
    <div className="my-10">
      <h2 className="font-bold text-3xl">Course List</h2>

      {course?.length !== 0 ? (
        <div>List of Courses</div>
      ) : (
        <div className="flex p-7 items-center justify-center flex-col border rounded-xl mt-2 bg-secondary gap-3">
          <Image src={"/book.svg"} width={35} height={35} alt="book" />
          <h2 className="my-2 text-xl font-bold">
            No Courses Created or Available
          </h2>
          <AddCourse>
            <Button>Create your course</Button>
          </AddCourse>
        </div>
      )}
    </div>
  );
};

export default CourseList;
