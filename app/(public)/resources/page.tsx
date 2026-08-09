import { getResources } from "@/lib/data/public";

export const revalidate = 300;

export default async function ResourcesPage() {
  const resources = await getResources();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-brand-primary">Resources</h1>
      <p className="mt-2 text-gray-600">Downloadable syllabus, notes, and study material.</p>

      {resources.length === 0 ? (
        <p className="mt-8 text-sm text-gray-500">No resources uploaded yet.</p>
      ) : (
        <ul className="mt-8 divide-y divide-gray-200 rounded-lg border border-gray-200">
          {resources.map((resource) => (
            <li key={resource.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="font-medium text-gray-900">{resource.title}</p>
                {resource.category && (
                  <p className="text-xs text-gray-500">{resource.category}</p>
                )}
              </div>
              <a
                href={resource.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-brand-primary hover:underline"
              >
                Download
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
