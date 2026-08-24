export type WorkCategory = "type-boundary" | "dev-flow" | "this-site";

export const WORK_CATEGORY_LABELS: Record<WorkCategory, string> = {
	"type-boundary": "型で境界を守る",
	"dev-flow": "開発フローを仕組みに",
	"this-site": "このサイト自体",
};

export interface Work {
	slug: string;
	title: string;
	summary: string;
	/**
	 * 推測で埋めない。外部リポジトリは GitHub API の language フィールドと
	 * リポジトリ自身の description に書かれているものだけを載せる。
	 * このサイト自身は package.json の依存から取る。
	 */
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
		// language: TypeScript / description に Tauri・Rust・TypeScript の記載あり
		tech: ["TypeScript", "Rust", "Tauri"],
		repoUrl: "https://github.com/UtakataKyosui/tauri-invoke-binding",
		category: "type-boundary",
	},
	{
		slug: "is-agent-friendly-ci",
		title: "is-agent-friendly-ci",
		summary:
			"「AIエージェントフレンドリーな CLI 設計の8原則」を GitHub Action として機械判定に落とす。",
		// language: Shell（TypeScript ではない）
		tech: ["Shell", "GitHub Actions"],
		repoUrl: "https://github.com/UtakataKyosui/is-agent-friendly-ci",
		category: "dev-flow",
	},
	{
		slug: "this-site",
		title: "このサイト自体",
		summary:
			"ライト / ダーク両対応のガラス調 UI と、GitHub の公開リポジトリを集計した実データ表示。",
		// Cloudflare Workers は未デプロイのため載せない（#11 完了後に追加する）
		tech: ["TanStack Start", "Tailwind CSS"],
		category: "this-site",
	},
];

export function getWorkBySlug(slug: string): Work | undefined {
	return works.find((work) => work.slug === slug);
}
