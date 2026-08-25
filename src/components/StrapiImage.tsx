import { useEffect, useState } from "react";
import { getStrapiMedia } from "#/lib/strapi-utils.ts";

interface StrapiImageProps {
	src: string | undefined | null;
	alt?: string | null;
	className?: string;
	width?: number | string;
	height?: number | string;
}

export function StrapiImage({
	src,
	alt,
	className = "",
	width,
	height,
}: StrapiImageProps) {
	const [hasError, setHasError] = useState(false);

	// src が変わっても React は同じコンポーネントインスタンスを再利用する
	// （例: /writing/$slug で別の記事に遷移した場合）。hasError をリセット
	// しないと、前の記事の画像でエラーになった状態が次の記事にも
	// 引き継がれ、正常な画像でも「Image not available」が出続ける。
	// biome-ignore lint/correctness/useExhaustiveDependencies: src の変化を検知してリセットするためだけの effect で、本体では src を参照しない
	useEffect(() => {
		setHasError(false);
	}, [src]);

	if (!src) return null;

	const imageUrl = getStrapiMedia(src);

	if (hasError) {
		return (
			<div
				className={`flex items-center justify-center bg-[var(--chip-bg)] text-sm text-[var(--sea-ink-soft)] ${className}`}
				style={{ width, height }}
			>
				<span>Image not available</span>
			</div>
		);
	}

	return (
		<img
			src={imageUrl}
			alt={alt || ""}
			width={width}
			height={height}
			loading="lazy"
			className={`object-cover ${className}`}
			onError={() => setHasError(true)}
		/>
	);
}
