import type { Tables } from "@/types/database.types";
import { formatPaise } from "@/lib/money";

type Course = Tables<"courses">;

export default function CourseCard({ course }: { course: Course }) {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-gray-200 p-6 shadow-sm">
      <div>
        <h3 className="text-lg font-bold text-brand-primary">{course.name}</h3>
        {course.duration_label && (
          <p className="mt-1 text-sm text-gray-500">{course.duration_label}</p>
        )}
        {course.description && (
          <p className="mt-3 text-sm text-gray-700">{course.description}</p>
        )}
      </div>
      <p className="mt-4 text-xl font-bold text-brand-primary">
        {course.is_price_tbd ? "TBD" : formatPaise(course.price_paise)}
      </p>
    </div>
  );
}
