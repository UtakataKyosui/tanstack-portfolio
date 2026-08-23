// Colors follow GitHub's linguist language-color convention.
export const LANGUAGE_COLORS: Record<string, string> = {
	TypeScript: "#3178c6",
	JavaScript: "#f1e05a",
	Rust: "#dea584",
	Python: "#3572a5",
	Go: "#00add8",
	HCL: "#844fba",
	Shell: "#89e051",
	HTML: "#e34c26",
	CSS: "#563d7c",
	Ruby: "#701516",
	TeX: "#3d6117",
	Dockerfile: "#384d54",
	Kotlin: "#a97bff",
	Swift: "#f05138",
	Astro: "#ff5a03",
	Vue: "#41b883",
	Svelte: "#ff3e00",
	"Jupyter Notebook": "#da5b0b",
	Nix: "#7e7eff",
	Makefile: "#427819",
	MDX: "#fcb32c",
	SCSS: "#c6538c",
};

export const FALLBACK_LANGUAGE_COLOR = "#8b949e";

export function languageColor(name: string): string {
	return LANGUAGE_COLORS[name] ?? FALLBACK_LANGUAGE_COLOR;
}
