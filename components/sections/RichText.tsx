import type { RichTextContent } from "@/lib/sections/types/rich-text";
import Markdown from "@/components/Markdown";

export default function RichText({ heading, body_markdown }: RichTextContent) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-14">
      {heading && (
        <h2 className="mb-4 text-2xl font-bold text-brand-primary sm:text-3xl">{heading}</h2>
      )}
      <Markdown>{body_markdown}</Markdown>
    </section>
  );
}
