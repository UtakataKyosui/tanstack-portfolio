import { techIcon } from "#/data/tech-icons.ts";

export function TechIcon({ name, size = 16 }: { name: string; size?: number }) {
	const icon = techIcon(name);

	if (icon) {
		return (
			<svg
				role="img"
				aria-hidden="true"
				viewBox="0 0 24 24"
				width={size}
				height={size}
				fill={`#${icon.hex}`}
				className="shrink-0"
			>
				<path d={icon.path} />
			</svg>
		);
	}

	return (
		<span
			aria-hidden="true"
			className="flex shrink-0 items-center justify-center rounded-full bg-[var(--line)] text-[10px] font-bold text-[var(--sea-ink-soft)]"
			style={{ width: size, height: size }}
		>
			{name.charAt(0)}
		</span>
	);
}
