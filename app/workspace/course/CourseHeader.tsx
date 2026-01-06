import { Progress } from "@/components/ui/progress";

export function CourseHeader({
  title,
  currentIndex,
  total,
}: {
  title: string;
  currentIndex: number;
  total: number;
}) {
  const value = Math.round(((currentIndex + 1) / total) * 100);

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <div className="mb-6">
        <Progress value={value} />
        <p className="text-sm text-gray-600 mt-1">{value}% completed</p>
      </div>
    </>
  );
}
