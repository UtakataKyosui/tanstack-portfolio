import type { ReactNode } from "react";

/**
 * 個別記事の本文。MDX は依存追加とビルド設定が発生するため見送り、
 * TSX に直接書く方式にした（#3 での決定）。
 * slug に対応するエントリが無い場合は works/$slug.tsx 側で
 * 「準備中」のプレースホルダーを表示する。
 */
type ChecklistItem = {
	no: string;
	name: string;
	severity: "required" | "recommended";
	description: string;
};

const CHECKLIST: ChecklistItem[] = [
	{
		no: "01",
		name: "構造化出力",
		severity: "required",
		description: "`schema_version` + `kind` を持つ JSON を stdout に出力",
	},
	{
		no: "02",
		name: "セマンティック終了コード",
		severity: "required",
		description: "0 (成功) / 2 (引数エラー) / 3 (未発見)",
	},
	{
		no: "03",
		name: "非対話モード",
		severity: "required",
		description: "TTY・stdin なしで完了、インタラクティブプロンプトなし",
	},
	{
		no: "04",
		name: "Noun-Verb 文法",
		severity: "required",
		description: "`<cli> <名詞> <動詞>` の形式に従う",
	},
	{
		no: "05",
		name: "スキーマ自己記述",
		severity: "recommended",
		description: "`describe` コマンドで引数構造を JSON 返却",
	},
	{
		no: "06",
		name: "アクション可能エラー",
		severity: "recommended",
		description: "エラー JSON に `next_step` / `candidates` フィールドを含む",
	},
	{
		no: "07",
		name: "冪等操作",
		severity: "recommended",
		description: "`--dry-run` フラグをサポート",
	},
	{
		no: "08",
		name: "コンポーザビリティ",
		severity: "recommended",
		description: "`--format json` / `--format tsv` フラグをサポート",
	},
];

function SeverityBadge({ severity }: { severity: ChecklistItem["severity"] }) {
	const isRequired = severity === "required";
	return (
		<span
			className={
				isRequired
					? "rounded-full border border-[var(--chip-line)] bg-[var(--sea-ink)]/10 px-2 py-0.5 text-xs font-semibold text-[var(--sea-ink)]"
					: "rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-2 py-0.5 text-xs text-[var(--sea-ink-soft)]"
			}
		>
			{isRequired ? "required" : "recommended"}
		</span>
	);
}

/**
 * 個別記事の本文。MDX は依存追加とビルド設定が発生するため見送り、
 * TSX に直接書く方式にした（#3 での決定）。
 * slug に対応するエントリが無い場合は works/$slug.tsx 側で
 * 「準備中」のプレースホルダーを表示する。
 */
export const workBodies: Partial<Record<string, () => ReactNode>> = {
	"is-agent-friendly-ci": () => (
		<div className="prose-work flex flex-col gap-8">
			<section className="flex flex-col gap-3">
				<h2 className="m-0 text-xl font-bold text-[var(--sea-ink)]">
					何をする CI か
				</h2>
				<p className="m-0 leading-8 text-[var(--sea-ink-soft)]">
					<code>is-agent-friendly-ci</code> は、開発中の CLI が「AI
					エージェントにとって使いやすい設計になっているか」を GitHub Actions
					上で機械的にチェックするツール。ベースにしているのは自作の独自基準ではなく、
					<a
						href="https://zenn.dev/assign/articles/b3d1d07d385b87"
						target="_blank"
						rel="noreferrer"
						className="text-[var(--sea-ink)] underline underline-offset-2"
					>
						「AIエージェントフレンドリーな CLI 設計の8原則」
					</a>
					という公開された記事の基準。ワークフローに組み込むと、対象の CLI
					コマンドに対して 8 つの原則それぞれをテストし、合否を判定する。
				</p>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="m-0 text-xl font-bold text-[var(--sea-ink)]">
					チェック項目（8原則）
				</h2>
				<p className="m-0 leading-8 text-[var(--sea-ink-soft)]">
					8 項目は <code>required</code>（必須 4 項目）と{" "}
					<code>recommended</code>（推奨 4 項目）に分かれている。
					<code>severity</code> オプションでどこまでを CI
					失敗の基準にするか調整でき、README では「まず <code>required</code>{" "}
					から始めて、徐々に <code>recommended</code>{" "}
					へ引き上げる」導入が推奨されている。
				</p>
				<div className="overflow-x-auto rounded-xl border border-[var(--chip-line)]">
					<table className="w-full min-w-[520px] border-collapse text-sm">
						<thead>
							<tr className="border-b border-[var(--chip-line)] text-left text-[var(--sea-ink-soft)]">
								<th className="px-3 py-2 font-semibold">#</th>
								<th className="px-3 py-2 font-semibold">項目名</th>
								<th className="px-3 py-2 font-semibold">重要度</th>
								<th className="px-3 py-2 font-semibold">内容</th>
							</tr>
						</thead>
						<tbody>
							{CHECKLIST.map((item) => (
								<tr
									key={item.no}
									className="border-b border-[var(--chip-line)] last:border-b-0"
								>
									<td className="px-3 py-2 align-top text-[var(--sea-ink-soft)]">
										{item.no}
									</td>
									<td className="px-3 py-2 align-top font-medium text-[var(--sea-ink)]">
										{item.name}
									</td>
									<td className="px-3 py-2 align-top">
										<SeverityBadge severity={item.severity} />
									</td>
									<td className="px-3 py-2 align-top text-[var(--sea-ink-soft)]">
										{item.description}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="m-0 text-xl font-bold text-[var(--sea-ink)]">
					設計思想: 独自基準ではなく公開基準を実装する
				</h2>
				<p className="m-0 leading-8 text-[var(--sea-ink-soft)]">
					このツールの中心は、8
					原則という設計指針そのものを新しく考えることではなく、すでに公開されている
					基準を GitHub Action として実行可能な形に落とし込んだことにある。
					「CLI が AI にとって使いやすいかどうかを気をつけて設計する」という
					人手のレビュー観点を、「CI
					上で機械的に判定する」というテスト可能な形に変換している。
				</p>
				<p className="m-0 leading-8 text-[var(--sea-ink-soft)]">
					また README には、<code>@main</code> ではなくリリースタグ（例:{" "}
					<code>@v1.0.0</code>）またはコミット SHA
					で固定して利用することを推奨する注意書きがある。Action
					自体の将来の破壊的変更が利用側のワークフローに影響しないよう、
					あらかじめ運用上の注意点を明記する形になっている。
				</p>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="m-0 text-xl font-bold text-[var(--sea-ink)]">
					なぜ作ったか
				</h2>
				<p className="m-0 leading-8 text-[var(--sea-ink-soft)]">
					[TODO: 本人記入]
				</p>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="m-0 text-xl font-bold text-[var(--sea-ink)]">
					他の開発フロー系ツールとの関係
				</h2>
				<p className="m-0 leading-8 text-[var(--sea-ink-soft)]">
					<code>gh-otel-harness</code> / <code>gh-pr-time</code> /{" "}
					<code>AgentFlow</code> など、他の開発フロー系ツールに触れるかどうかは
					[TODO: 本人記入]
				</p>
			</section>
		</div>
	),
};
