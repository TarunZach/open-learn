"use client";
import { RequiredLabel } from "@/app/resuable/components/RequiredLabel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CourseFormData, ProviderProps } from "@/lib/types";
import { COURSE_CATEGORY_OPTIONS } from "@/lib/types";
import { Sparkle } from "lucide-react";
import { useState } from "react";

const AddCourse = ({ children }: ProviderProps) => {
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    description: "",
    topics: 0,
    includeVideo: false,
    category: COURSE_CATEGORY_OPTIONS[0],
  });

  const onHandleChange = <K extends keyof CourseFormData>(
    field: K,
    value: CourseFormData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const createCourse = () => {
    console.log(formData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new course</DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-col gap-3 mt-3 p-2">
              <div className="flex flex-col gap-1">
                <RequiredLabel>Course Name</RequiredLabel>
                <Input
                  placeholder="Course Name"
                  required
                  onChange={(e) => onHandleChange("title", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <RequiredLabel>Category</RequiredLabel>
                <Select
                  onValueChange={(value) =>
                    onHandleChange(
                      "category",
                      value as CourseFormData["category"]
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {COURSE_CATEGORY_OPTIONS.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1">
                <RequiredLabel>No. of Topics</RequiredLabel>
                <Input
                  type="number"
                  placeholder="eg. 1, 2, 5"
                  required
                  onChange={(e) =>
                    onHandleChange("topics", Number(e.target.value))
                  }
                />
              </div>

              <div className="flex gap-3 items-center">
                <label>Include Video</label>
                <Switch
                  onCheckedChange={(value) =>
                    onHandleChange("includeVideo", value)
                  }
                />
              </div>

              <div className="flex flex-col gap-1">
                <label>Course Description (optional)</label>
                <Textarea
                  placeholder="Course Description"
                  onChange={(e) =>
                    onHandleChange("description", e.target.value)
                  }
                />
              </div>

              <div className="mt-10">
                <Button className="w-full" onClick={createCourse}>
                  <Sparkle /> Create Course
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddCourse;
