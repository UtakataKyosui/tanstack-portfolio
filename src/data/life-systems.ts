/**
 * 「生活を仕組みにした」ツール群の一覧データ。
 *
 * Works の個別記事（`Work` 型 / `/works/$slug`）とは別枠。
 * ここに載る作品は個別ページを持たず、`/works` 一覧内の専用セクションで
 * まとめて表示するだけにとどめる（反復の密度を見せることが目的で、
 * 1件ずつ深掘りすると逆に印象が薄まるため）。
 *
 * 掲載する6〜8件はissue #6の時点でリポジトリ本人が未確定。
 * ここでは候補として挙がった8件を暫定的に全件含めている。
 * 説明文は推測で埋めない。GitHub上に description があるものはそれを使い、
 * description が無いもの（subscription-manager / ChunkPomodoroExtension /
 * CronManager の3件、GitHub API で確認済み）は issue #6 本文に書かれている
 * 説明をそのまま使っている。
 */

export interface LifeSystemEntry {
	slug: string;
	title: string;
	summary: string;
	repoUrl: string;
}

export const lifeSystems: LifeSystemEntry[] = [
	{
		slug: "recommend-medicine-server",
		title: "RecommendMedicineServer",
		summary: "薬を飲む時間を忘れないよう通知する。",
		repoUrl: "https://github.com/UtakataKyosui/RecommendMedicineServer",
	},
	{
		slug: "clothing-cluster",
		title: "Clothing-Cluster",
		summary: "服の組み合わせを管理する。",
		repoUrl: "https://github.com/UtakataKyosui/Clothing-Cluster",
	},
	{
		slug: "home-clean-adviser",
		title: "HomeCleanAdviser",
		summary: "家の片付け方についてアドバイスをもらう。",
		repoUrl: "https://github.com/UtakataKyosui/HomeCleanAdviser",
	},
	{
		slug: "subscription-manager",
		title: "subscription-manager",
		summary: "契約しているサブスクリプションを管理する。",
		repoUrl: "https://github.com/UtakataKyosui/subscription-manager",
	},
	{
		slug: "chunk-pomodoro-extension",
		title: "ChunkPomodoroExtension",
		summary: "ポモドーロ・テクニックで作業を区切るブラウザ拡張。",
		repoUrl: "https://github.com/UtakataKyosui/ChunkPomodoroExtension",
	},
	{
		slug: "disk-cleanup",
		title: "disk-cleanup",
		summary: "Ubuntu のディスク容量クリーンアップ手順とスクリプト。",
		repoUrl: "https://github.com/UtakataKyosui/disk-cleanup",
	},
	{
		slug: "cron-manager",
		title: "CronManager",
		summary: "cron ジョブを管理する。",
		repoUrl: "https://github.com/UtakataKyosui/CronManager",
	},
	{
		slug: "repositories-and-project-manager",
		title: "RepositoriesAndProjectManager",
		summary: "自分が今取り組んでいる個人開発の活動を管理する。デプロイ済み。",
		repoUrl: "https://github.com/UtakataKyosui/RepositoriesAndProjectManager",
	},
];
