export type WorkCategory =
	| "type-boundary"
	| "dev-flow"
	| "life-systems"
	| "this-site";

export const WORK_CATEGORY_LABELS: Record<WorkCategory, string> = {
	"type-boundary": "型で境界を守る",
	"dev-flow": "開発フローを仕組みに",
	"life-systems": "生活を仕組みに",
	"this-site": "このサイト自体",
};

export interface Work {
	slug: string;
	title: string;
	summary: string;
	tech: string[];
	repoUrl?: string;
	demoUrl?: string;
	category: WorkCategory;
}

export const works: Work[] = [
	{
		slug: "tauri-invoke-binding",
		title: "tauri-invoke-binding",
		summary:
			"Tauri の invoke 呼び出しに型の境界を通す。既存の型生成を再発明せず、周辺のランタイム層だけを埋める。",
		tech: ["TypeScript", "Rust", "Tauri", "specta"],
		repoUrl: "https://github.com/UtakataKyosui/tauri-invoke-binding",
		category: "type-boundary",
	},
	{
		slug: "is-agent-friendly-ci",
		title: "is-agent-friendly-ci",
		summary:
			"「AIエージェントフレンドリーな CLI 設計の8原則」を GitHub Action として機械判定に落とす。",
		tech: ["GitHub Actions", "TypeScript"],
		repoUrl: "https://github.com/UtakataKyosui/is-agent-friendly-ci",
		category: "dev-flow",
	},
	{
		slug: "this-site",
		title: "このサイト自体",
		summary:
			"ライト / ダーク両対応のガラス調 UI と、GitHub の公開リポジトリを集計した実データ表示。",
		tech: ["TanStack Start", "Tailwind CSS", "Cloudflare Workers"],
		category: "this-site",
	},
];

export function getWorkBySlug(slug: string): Work | undefined {
	return works.find((work) => work.slug === slug);
}
