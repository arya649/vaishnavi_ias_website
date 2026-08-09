import { notFound } from "next/navigation";
import CourseCard from "@/components/public/CourseCard";
import { getCourses } from "@/lib/data/public";

export const revalidate = 300;

const trackTitles: Record<string, string> = {
  classes: "Classes",
  mentorship: "Mentorship",
};

export default async function CourseTrackPage({
  params,
}: {
  params: Promise<{ track: string }>;
}) {
  const { track } = await params;
  if (!trackTitles[track]) notFound();

  const courses = (await getCourses()).filter((c) => c.track === track);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold text-brand-primary">{trackTitles[track]}</h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>
    </div>
  );
}
