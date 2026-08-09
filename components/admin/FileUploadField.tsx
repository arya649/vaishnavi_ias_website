"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { labelClass } from "./ui";

// Uploads directly to Supabase Storage from the browser (allowed by the
// `admin write ...` bucket policies for authenticated users, see
// supabase/migrations/0001_init.sql) and writes the resulting public URL into
// a hidden input so the surrounding <form> Server Action just sees a string.
export default function FileUploadField({
  name,
  label,
  bucket,
  pathPrefix,
  initialUrl,
  accept,
  onUrlChange,
}: {
  name: string;
  label: string;
  bucket: "public-assets" | "resources";
  pathPrefix: string;
  initialUrl?: string | null;
  accept?: string;
  // Optional: lifts the uploaded URL to a parent's controlled state, for
  // forms that submit a JS object (e.g. section JSONB content) instead of
  // relying on this component's own hidden <input> inside a native FormData
  // submission.
  onUrlChange?: (url: string) => void;
}) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const supabase = createClient();
    const path = `${pathPrefix}/${crypto.randomUUID()}-${file.name}`;

    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    setUrl(data.publicUrl);
    onUrlChange?.(data.publicUrl);
    setUploading(false);
  }

  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input type="hidden" name={name} value={url} />
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="mt-1 block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white"
      />
      {uploading && <p className="mt-1 text-xs text-slate-500">Uploading…</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {url && !uploading && (
        <div className="mt-2 flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="" className="h-12 w-12 rounded object-cover" />
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:underline">
            View current file
          </a>
        </div>
      )}
    </div>
  );
}
