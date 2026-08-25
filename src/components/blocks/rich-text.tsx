import { MarkdownContent } from "#/components/MarkdownContent.tsx";

export interface IRichText {
	__component: "shared.rich-text";
	id: number;
	body: string;
}

export function RichText({ body }: Readonly<IRichText>) {
	return <MarkdownContent content={body} />;
}
