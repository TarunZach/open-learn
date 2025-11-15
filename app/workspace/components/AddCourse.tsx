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
import { ProviderProps } from "@/lib/types";

const COURSE_CATEGORY_OPTIONS = [
  "programming",
  "ai",
  "business",
  "health",
  "science",
  "productivity",
  "language",
] as const;

const AddCourse = ({ children }: ProviderProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new course</DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-col gap-3 mt-3 p-2">
              <div className="flex flex-col gap-1">
                <label>Course Name</label>
                <Input placeholder="Course Name" required />
              </div>
              <div className="flex flex-col gap-1">
                <label>Course Description</label>
                <Textarea placeholder="Course Description" />
              </div>
              <div className="flex flex-col gap-1">
                <label>No. of Topics</label>
                <Input placeholder="eg. 1, 2, 5 etc." type="number" />
              </div>
              <div className="flex gap-3 items-center">
                <label>Include Video</label>
                <Switch />
              </div>
              <div className="flex flex-col gap-1">
                <label>Category</label>
                <Select>
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

              <div>
                <Button>Create Course</Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddCourse;
