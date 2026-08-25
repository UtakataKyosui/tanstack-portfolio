import { StrapiImage } from "#/components/StrapiImage.tsx";
import type { TImage } from "#/types/strapi.ts";

export interface IMedia {
	__component: "shared.media";
	id: number;
	file?: TImage;
}

export function Media({ file }: Readonly<IMedia>) {
	if (!file) return null;

	return (
		<figure className="my-8">
			<StrapiImage
				src={file.url}
				alt={file.alternativeText || ""}
				className="w-full rounded-lg"
			/>
			{file.alternativeText && (
				<figcaption className="mt-2 text-center text-sm text-[var(--sea-ink-soft)]">
					{file.alternativeText}
				</figcaption>
			)}
		</figure>
	);
}
