import { StrapiImage } from "#/components/StrapiImage.tsx";
import type { TImage } from "#/types/strapi.ts";

export interface ISlider {
	__component: "shared.slider";
	id: number;
	files?: Array<TImage>;
}

export function Slider({ files }: Readonly<ISlider>) {
	if (!files || files.length === 0) return null;

	return (
		<div className="my-8">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				{files.map((file, index) => (
					<figure key={file.id || index}>
						<StrapiImage
							src={file.url}
							alt={file.alternativeText || ""}
							className="h-48 w-full rounded-lg object-cover"
						/>
					</figure>
				))}
			</div>
		</div>
	);
}
