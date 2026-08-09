import CourseCard from "@/components/public/CourseCard";
import { getCourses } from "@/lib/data/public";

export const revalidate = 300;

export default async function CoursesPage() {
  const courses = await getCourses();
  const classes = courses.filter((c) => c.track === "classes");
  const mentorship = courses.filter((c) => c.track === "mentorship");

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold text-brand-primary">Courses</h1>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">Classes</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-bold text-gray-900">Mentorship</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mentorship.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </section>
    </div>
  );
}
