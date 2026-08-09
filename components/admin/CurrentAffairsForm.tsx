import { Field, inputClass, labelClass, buttonClass } from "@/components/admin/ui";
import FileUploadField from "@/components/admin/FileUploadField";
import type { Tables } from "@/types/database.types";

export default function CurrentAffairsForm({
  action,
  siteSlug,
  post,
}: {
  action: (formData: FormData) => void;
  siteSlug: string;
  post?: Tables<"current_affairs_posts">;
}) {
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <Field label="Title" htmlFor="title">
        <input id="title" name="title" defaultValue={post?.title} required className={inputClass} />
      </Field>
      <Field label="Slug (URL)" htmlFor="slug">
        <input id="slug" name="slug" defaultValue={post?.slug} required className={inputClass} />
      </Field>
      <Field label="Post Date" htmlFor="post_date">
        <input
          id="post_date"
          name="post_date"
          type="date"
          defaultValue={post?.post_date ?? new Date().toISOString().slice(0, 10)}
          required
          className={inputClass}
        />
      </Field>
      <Field label="YouTube URL (optional)" htmlFor="youtube_url">
        <input id="youtube_url" name="youtube_url" defaultValue={post?.youtube_url ?? ""} className={inputClass} />
      </Field>
      <div className="sm:col-span-2">
        <FileUploadField
          name="thumbnail_url"
          label="Thumbnail"
          bucket="public-assets"
          pathPrefix={`${siteSlug}/current-affairs`}
          initialUrl={post?.thumbnail_url}
          accept="image/*"
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="body_markdown" className={labelClass}>
          Body (Markdown)
        </label>
        <textarea
          id="body_markdown"
          name="body_markdown"
          rows={10}
          defaultValue={post?.body_markdown}
          required
          className={inputClass}
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input name="is_published" type="checkbox" defaultChecked={post?.is_published ?? true} /> Published
      </label>
      <div className="sm:col-span-2">
        <button type="submit" className={buttonClass}>
          {post ? "Save" : "Create Post"}
        </button>
      </div>
    </form>
  );
}
