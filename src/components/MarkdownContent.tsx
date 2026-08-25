import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownContentProps {
	content: string | undefined | null;
	className?: string;
}

export function MarkdownContent({
	content,
	className = "",
}: MarkdownContentProps) {
	if (!content) return null;

	return (
		<div
			className={`prose max-w-none prose-headings:text-[var(--sea-ink)] prose-p:text-[var(--sea-ink-soft)] prose-a:text-[var(--lagoon-deep)] prose-strong:text-[var(--sea-ink)] prose-blockquote:border-l-[var(--lagoon-deep)] prose-blockquote:text-[var(--sea-ink-soft)] prose-code:text-[var(--sea-ink)] prose-th:text-[var(--sea-ink)] prose-td:text-[var(--sea-ink-soft)] prose-li:text-[var(--sea-ink-soft)] prose-hr:border-[var(--line)] ${className}`}
		>
			<Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
		</div>
	);
}
