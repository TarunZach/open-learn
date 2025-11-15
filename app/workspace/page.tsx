import CourseList from "./components/CourseList";
import WelcomeBanner from "./components/WelcomeBanner";

export default function Workspace() {
  return (
    <div>
      <WelcomeBanner />
      <CourseList />
    </div>
  );
}
