"use client";

import { LoadingSpinner } from "@/app/resuable/components/LoadingSpinner";
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
import {
  COURSE_LEVEL_OPTIONS,
  CourseFormData,
  ProviderProps,
} from "@/lib/types";
import { COURSE_CATEGORY_OPTIONS } from "@/lib/types";
import { Sparkle } from "lucide-react";
import { useState } from "react";

const AddCourse = ({ children }: ProviderProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    description: "",
    topics: 0,
    includeAudio: false,
    audioFile: null,
    category: COURSE_CATEGORY_OPTIONS[0],
    level: COURSE_LEVEL_OPTIONS[0],
    transcript: "",
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

  const createCourse = async () => {
    setLoading(true);

    const payload: CourseFormData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      level: formData.level,
      topics: formData.topics,
      transcript: formData.transcript || "",
    };

    if (formData.includeAudio && formData.audioFile) {
      payload.includeAudio = true;
      payload.audioFile = formData.audioFile;
    }

    try {
      const response = await fetch("/api/generate-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error("API Error:", await response.text());
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log("Generated Course:", data);

      // Close modal after success
      setOpen(false);
    } catch (error) {
      console.error("API Call Failed:", error);
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        {loading ? (
          <div className="flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <>
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
                            {category.charAt(0).toUpperCase() +
                              category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <RequiredLabel>Difficulty Level</RequiredLabel>
                    <Select
                      onValueChange={(value) =>
                        onHandleChange(
                          "level",
                          value as CourseFormData["level"]
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Difficulty Level" />
                      </SelectTrigger>
                      <SelectContent>
                        {COURSE_LEVEL_OPTIONS.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level.charAt(0).toUpperCase() + level.slice(1)}
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
                    <label>Include Audio</label>
                    <Switch
                      onCheckedChange={(value) =>
                        onHandleChange("includeAudio", value)
                      }
                    />
                  </div>

                  {formData.includeAudio && (
                    <div className="flex flex-col gap-1">
                      <RequiredLabel>Upload Audio File</RequiredLabel>
                      <Input
                        type="file"
                        accept="audio/*"
                        onChange={(e) =>
                          onHandleChange(
                            "audioFile",
                            e.target.files?.[0] || null
                          )
                        }
                      />
                    </div>
                  )}

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
                    <Button
                      className="w-full"
                      onClick={createCourse}
                      disabled={loading}
                    >
                      <Sparkle /> Create Course
                    </Button>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddCourse;
