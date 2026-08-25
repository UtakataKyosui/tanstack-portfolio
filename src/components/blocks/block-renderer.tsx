import type { IMedia } from "./media.tsx";
import { Media } from "./media.tsx";
import type { IQuote } from "./quote.tsx";
import { Quote } from "./quote.tsx";
import type { IRichText } from "./rich-text.tsx";
import { RichText } from "./rich-text.tsx";
import type { ISlider } from "./slider.tsx";
import { Slider } from "./slider.tsx";

export type Block = IRichText | IQuote | IMedia | ISlider;

interface BlockRendererProps {
	blocks: Array<Block>;
}

/**
 * BlockRenderer - Renders dynamic content blocks from Strapi
 *
 * Usage:
 * ```tsx
 * <BlockRenderer blocks={article.blocks} />
 * ```
 */
export function BlockRenderer({ blocks }: Readonly<BlockRendererProps>) {
	if (!blocks || blocks.length === 0) return null;

	const renderBlock = (block: Block) => {
		switch (block.__component) {
			case "shared.rich-text":
				return <RichText {...block} />;
			case "shared.quote":
				return <Quote {...block} />;
			case "shared.media":
				return <Media {...block} />;
			case "shared.slider":
				return <Slider {...block} />;
			default:
				console.warn(
					"Unknown block type:",
					(block as { __component?: string }).__component,
				);
				return null;
		}
	};

	return (
		<div className="space-y-6">
			{blocks.map((block) => (
				<div key={`${block.__component}-${block.id}`}>{renderBlock(block)}</div>
			))}
		</div>
	);
}
