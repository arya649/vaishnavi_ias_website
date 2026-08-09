import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

// Shared sanitized Markdown renderer for every admin-authored text field
// (rich_text sections, FAQ answers, current-affairs posts, test-series
// details). Never render admin-authored markdown without this wrapper.
export default function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-slate max-w-none prose-headings:text-brand-primary prose-a:text-brand-primary">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
