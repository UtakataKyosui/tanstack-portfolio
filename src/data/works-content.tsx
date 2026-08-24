import type { ReactNode } from "react";

/**
 * 個別記事の本文。MDX は依存追加とビルド設定が発生するため見送り、
 * TSX に直接書く方式にした（#3 での決定）。
 * slug に対応するエントリが無い場合は works/$slug.tsx 側で
 * 「準備中」のプレースホルダーを表示する。
 */

/** 本人記入待ちの一人称記述を示す明示的なプレースホルダー。事実は書かない。 */
function TodoNote({ children }: { children: ReactNode }) {
	return (
		<div className="my-4 rounded-xl border border-dashed border-[var(--chip-line)] bg-[var(--chip-bg)] px-4 py-3">
			<p className="m-0 text-xs font-bold uppercase tracking-[0.1em] text-[var(--sea-ink-soft)]">
				TODO: 本人記入
			</p>
			<p className="m-0 mt-1 text-sm leading-7 text-[var(--sea-ink-soft)]">
				{children}
			</p>
		</div>
	);
}

function SectionHeading({ children }: { children: ReactNode }) {
	return (
		<h2 className="display-title mb-3 mt-10 text-xl font-bold text-[var(--sea-ink)] first:mt-0 sm:text-2xl">
			{children}
		</h2>
	);
}

function P({ children }: { children: ReactNode }) {
	return (
		<p className="m-0 mb-4 max-w-3xl text-[0.95rem] leading-8 text-[var(--sea-ink-soft)]">
			{children}
		</p>
	);
}

/** `Result<T, E>` が catch で unknown に潰れ、TransportError で判別可能ユニオンに戻す流れ。 */
function ResultCollapseDiagram() {
	const steps: {
		label: string;
		detail: string;
		tone: "ok" | "warn" | "good";
	}[] = [
		{
			label: "Rust: Result<T, E>",
			detail: "コマンドが Err(E) を返す",
			tone: "ok",
		},
		{
			label: "Tauri IPC 境界",
			detail: "Result が rejected Promise に潰れる",
			tone: "warn",
		},
		{
			label: "TS: catch (e)",
			detail: "e の型は unknown。E の情報は消えている",
			tone: "warn",
		},
		{
			label: "TransportError（判別可能ユニオン）",
			detail:
				"command / deserialization / command-not-found / permission-denied / panic / aborted / not-in-tauri / unknown を kind で分岐",
			tone: "good",
		},
	];

	const toneClass: Record<string, string> = {
		ok: "border-[var(--chip-line)] bg-[var(--chip-bg)]",
		warn: "border-[color-mix(in_oklab,var(--sea-ink-soft)_45%,transparent)] bg-transparent",
		good: "border-[var(--chip-line)] bg-[var(--chip-bg)]",
	};

	return (
		<div className="my-6 flex flex-col items-stretch gap-2 sm:gap-3">
			{steps.map((step, i) => (
				<div key={step.label} className="flex flex-col items-center">
					<div
						className={`w-full rounded-xl border px-4 py-3 text-center sm:px-6 ${toneClass[step.tone]}`}
					>
						<p className="m-0 text-sm font-semibold text-[var(--sea-ink)]">
							{step.label}
						</p>
						<p className="m-0 mt-1 text-xs leading-6 text-[var(--sea-ink-soft)]">
							{step.detail}
						</p>
					</div>
					{i < steps.length - 1 && (
						<span
							aria-hidden="true"
							className="my-1 text-lg leading-none text-[var(--sea-ink-soft)]"
						>
							↓
						</span>
					)}
				</div>
			))}
		</div>
	);
}

interface ExampleRow {
	problem: string;
	mechanism: string;
	project: string;
}

const examples: ExampleRow[] = [
	{
		problem: "invoke('コマンド名') が生の文字列で、typo が実行時まで分からない",
		mechanism:
			"コマンド名を型で縛る（tauri-specta 由来の CommandMap を受け取る、または手書きの CommandMap を型引数に渡す）",
		project: "tauri-invoke-binding",
	},
	{
		problem:
			"Result<T, E> が rejected Promise に潰れ、catch の値が unknown になる",
		mechanism:
			"TransportError の判別可能ユニオンと、決して throw しない .safe.* 呼び出し",
		project: "tauri-invoke-binding",
	},
	{
		problem:
			"#[tauri::command] が引数を camelCase 化し、TS 側から命名規則が見えない",
		mechanism: "snake_case の宣言から camelCase のアクセサ名を生成側で吸収する",
		project: "tauri-invoke-binding",
	},
	{
		problem: "テストのたびに Tauri の webview が要る",
		mechanism:
			"createMockClient で CommandMap 型そのままにモックし、vitest だけで完結させる",
		project: "tauri-invoke-binding",
	},
	{
		problem: "u64 / i64 を JS の number で受けると精度が静かに落ちる",
		mechanism: "u64 / i64 を自動的に bigint として生成する",
		project: "GearMesh",
	},
	{
		problem: "UserId と ProductId のような、同じ基底型を持つ ID を取り違える",
		mechanism:
			"Rust の newtype パターンを TypeScript の Branded Types に変換する",
		project: "GearMesh",
	},
	{
		problem: "API レスポンスの実行時検証を書き忘れる",
		mechanism: "Zod スキーマを型定義から自動生成する",
		project: "GearMesh",
	},
];

function ExampleTable() {
	return (
		<div className="my-6 overflow-x-auto rounded-xl border border-[var(--chip-line)]">
			<table className="w-full min-w-[640px] border-collapse text-sm">
				<thead>
					<tr className="bg-[var(--chip-bg)]">
						<th className="border-b border-[var(--chip-line)] px-3 py-2 text-left font-semibold text-[var(--sea-ink)]">
							気をつけること
						</th>
						<th className="border-b border-[var(--chip-line)] px-3 py-2 text-left font-semibold text-[var(--sea-ink)]">
							仕組み化
						</th>
						<th className="border-b border-[var(--chip-line)] px-3 py-2 text-left font-semibold text-[var(--sea-ink)]">
							由来
						</th>
					</tr>
				</thead>
				<tbody>
					{examples.map((row) => (
						<tr key={row.problem} className="align-top">
							<td className="border-b border-[var(--chip-line)] px-3 py-2 text-[var(--sea-ink-soft)]">
								{row.problem}
							</td>
							<td className="border-b border-[var(--chip-line)] px-3 py-2 text-[var(--sea-ink-soft)]">
								{row.mechanism}
							</td>
							<td className="border-b border-[var(--chip-line)] px-3 py-2 whitespace-nowrap text-xs text-[var(--sea-ink-soft)]">
								{row.project}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

function TauriInvokeBindingBody() {
	return (
		<article>
			<P>
				この作品は 2 つのリポジトリにまたがる、7
				ヶ月間のスコープ判断の記録である。2025 年 12 月に作成した{" "}
				<a
					href="https://github.com/UtakataKyosui/GearMesh"
					target="_blank"
					rel="noreferrer"
					className="nav-link"
				>
					GearMesh
				</a>{" "}
				は Rust → TypeScript の型生成そのものを自作するプロジェクトで、2026 年 7
				月に作成した{" "}
				<a
					href="https://github.com/UtakataKyosui/tauri-invoke-binding"
					target="_blank"
					rel="noreferrer"
					className="nav-link"
				>
					tauri-invoke-binding
				</a>{" "}
				は、型生成は
				<code className="rounded bg-[var(--chip-bg)] px-1 py-0.5 text-[0.85em]">
					tauri-specta
				</code>
				がすでに解決していると判断し、それを再発明せず周辺のランタイム層だけを埋めるプロジェクトである。
			</P>

			<SectionHeading>GearMesh（2025-12）: 型生成そのものを作る</SectionHeading>
			<P>
				GearMesh は Rust のマクロで TypeScript
				の型定義を生成するクレートで、Rust の newtype パターンを TypeScript の
				Branded Types に変換する機能、u64 / i64 を自動的に bigint
				として扱う機能、Zod スキーマの自動生成、Rust のドキュメントコメントから
				JSDoc への変換などを備えている。README 記載の言語は Rust。
			</P>

			<SectionHeading>
				tauri-invoke-binding（2026-07）: 型生成を前提にランタイム層だけを埋める
			</SectionHeading>
			<P>
				tauri-invoke-binding の README は冒頭の Non-goals で「Rust→TypeScript
				の型生成を行わない」ことを明記し、その理由として「tauri-specta / ts-rs
				によってすでによく解決されている問題」を挙げている。GearMesh
				が担っていた型生成そのものの領域には踏み込まず、
				<code className="rounded bg-[var(--chip-bg)] px-1 py-0.5 text-[0.85em]">
					tauri-specta
				</code>{" "}
				が生成した{" "}
				<code className="rounded bg-[var(--chip-bg)] px-1 py-0.5 text-[0.85em]">
					commands
				</code>{" "}
				オブジェクトをそのまま受け取り、型の再宣言なしに動く{" "}
				<code className="rounded bg-[var(--chip-bg)] px-1 py-0.5 text-[0.85em]">
					createClient
				</code>{" "}
				アダプタを起点に、型付きトランスポートエラー・ミドルウェア・モック・
				<code className="rounded bg-[var(--chip-bg)] px-1 py-0.5 text-[0.85em]">
					emitTo
				</code>
				・非同期イテラブルなチャンネル・生 IPC
				といった、型生成の「外側」にあるランタイムの隙間を埋める。README
				はこれらの隙間それぞれについて、対応する
				<code className="rounded bg-[var(--chip-bg)] px-1 py-0.5 text-[0.85em]">
					specta-rs/tauri-specta
				</code>
				側の upstream issue 番号（#169 / #170 / #172 / #187 /
				#197）を挙げ、2026-08-01
				時点でいずれも未クローズであることを確認した記録を残している。
			</P>

			<TodoNote>
				なぜ GearMesh
				で型生成そのものを自作しようとしたのか、そして何が判断材料になって
				「型生成は再発明しない」というスコープに切り替えたのか。
			</TodoNote>

			<SectionHeading>「気をつける」から「仕組み」へ — 実例</SectionHeading>
			<P>
				下の 7 件は、Tauri
				アプリの型安全性で見落としやすい点と、それぞれに対応する仕組みの
				組み合わせ。前半 4 件は tauri-invoke-binding が担うランタイム層、後半 3
				件は GearMesh が担う型生成層に属する。
			</P>
			<ExampleTable />

			<SectionHeading>
				Result が rejected Promise
				に潰れる流れと、それを判別可能ユニオンに戻す位置
			</SectionHeading>
			<P>
				tauri-invoke-binding の README がもっとも詳しく説明しているのが、この{" "}
				<code className="rounded bg-[var(--chip-bg)] px-1 py-0.5 text-[0.85em]">
					TransportError
				</code>{" "}
				の設計（upstream issue{" "}
				<a
					href="https://github.com/specta-rs/tauri-specta/issues/169"
					target="_blank"
					rel="noreferrer"
					className="nav-link"
				>
					tauri-specta#169
				</a>{" "}
				に対応）。Rust 側の
				<code className="rounded bg-[var(--chip-bg)] px-1 py-0.5 text-[0.85em]">
					Result&lt;T, E&gt;
				</code>
				は Tauri の IPC 境界を越える時点で型情報を失い、TypeScript 側では
				<code className="rounded bg-[var(--chip-bg)] px-1 py-0.5 text-[0.85em]">
					catch
				</code>
				で受け取る値が{" "}
				<code className="rounded bg-[var(--chip-bg)] px-1 py-0.5 text-[0.85em]">
					unknown
				</code>{" "}
				になる。
			</P>
			<ResultCollapseDiagram />
			<P>
				<code className="rounded bg-[var(--chip-bg)] px-1 py-0.5 text-[0.85em]">
					api.safe.*
				</code>{" "}
				はこの `TransportError`
				を返り値として返す（例外を投げない）呼び出し口で、
				<code className="rounded bg-[var(--chip-bg)] px-1 py-0.5 text-[0.85em]">
					assertExhaustive
				</code>
				と組み合わせることで、kind の分岐漏れをコンパイルエラーにできる。
			</P>

			<SectionHeading>README 自体が名乗りの実演になっている</SectionHeading>
			<P>
				tauri-invoke-binding の README は、実装済みの機能（
				<code className="rounded bg-[var(--chip-bg)] px-1 py-0.5 text-[0.85em]">
					createClient
				</code>
				・
				<code className="rounded bg-[var(--chip-bg)] px-1 py-0.5 text-[0.85em]">
					TransportError
				</code>
				・ミドルウェア・
				<code className="rounded bg-[var(--chip-bg)] px-1 py-0.5 text-[0.85em]">
					createMockClient
				</code>{" "}
				など）と、まだコードになっていない設計スケッチ（非 Tauri
				フォールバック、
				フレームワーク統合など）を行単位で区別している。すべての主張は
				<code className="rounded bg-[var(--chip-bg)] px-1 py-0.5 text-[0.85em]">
					specta-rs/tauri-specta
				</code>{" "}
				の upstream issue 番号に紐付けられており、冒頭の Status セクションと
				Upstream issue status のセクションには{" "}
				<code className="rounded bg-[var(--chip-bg)] px-1 py-0.5 text-[0.85em]">
					as of 2026-08-01
				</code>{" "}
				という確認日が明記されている。読者が実装済みかどうかを推測する必要がないように
				書かれている点自体が、このプロジェクトが体現しようとしている態度と一致している。
			</P>

			<TodoNote>
				この記事で語っている技術的な事実（README
				の構成や機能一覧）は本人以外でも検証できるが、
				何が楽しかったか・何に苦労したか・次にどうしたいかは本人にしか書けない。この節は
				その分の空欄。
			</TodoNote>
		</article>
	);
}

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
function ThisSiteH2({ children }: { children: ReactNode }) {
	return (
		<h2 className="display-title mt-10 mb-3 text-2xl font-bold text-[var(--sea-ink)] first:mt-0">
			{children}
		</h2>
	);
}

function ThisSiteH3({ children }: { children: ReactNode }) {
	return (
		<h3 className="mt-6 mb-2 text-lg font-semibold text-[var(--sea-ink)]">
			{children}
		</h3>
	);
}

function ThisSiteP({ children }: { children: ReactNode }) {
	return (
		<p className="m-0 mt-3 text-[0.95rem] leading-7 text-[var(--sea-ink-soft)]">
			{children}
		</p>
	);
}

function ThisSiteCode({ children }: { children: ReactNode }) {
	return <code>{children}</code>;
}

function ThisSiteStatRow({
	label,
	value,
	detail,
}: {
	label: string;
	value: string;
	detail?: string;
}) {
	return (
		<li className="flex items-baseline justify-between gap-3 border-b border-[var(--line)] py-2 text-sm last:border-b-0">
			<span className="text-[var(--sea-ink-soft)]">{label}</span>
			<span className="text-right">
				<span className="font-mono font-semibold text-[var(--sea-ink)]">
					{value}
				</span>
				{detail && (
					<span className="ml-2 text-xs text-[var(--sea-ink-soft)]">
						{detail}
					</span>
				)}
			</span>
		</li>
	);
}

function ThisSiteBody() {
	return (
		<article>
			<ThisSiteP>
				この記事はこのサイト自体を作品として解説する。作品ページとしては珍しく一人称の感想はほとんど出てこない。代わりに、実装の仕組みと、実際に測定した数値だけを載せる。
			</ThisSiteP>

			<ThisSiteH2>デザインシステム: 1箇所に定義したガラス表現</ThisSiteH2>
			<ThisSiteP>
				サイト全体で使っているすりガラス風のカード表現（ぼかし・グラデーション・縁取り）は、
				<ThisSiteCode>src/styles.css</ThisSiteCode> の中で{" "}
				<ThisSiteCode>@utility glass</ThisSiteCode>{" "}
				として一箇所にだけ定義している。 Tailwind CSS v4 の{" "}
				<ThisSiteCode>@utility</ThisSiteCode>{" "}
				記法で定義したユーティリティクラスは、
				<ThisSiteCode>Card</ThisSiteCode> / <ThisSiteCode>Button</ThisSiteCode>{" "}
				/ <ThisSiteCode>Badge</ThisSiteCode> それぞれの{" "}
				<ThisSiteCode>cva</ThisSiteCode>
				（class-variance-authority）バリアント定義から{" "}
				<ThisSiteCode>glass</ThisSiteCode> クラス名として参照される。
			</ThisSiteP>
			<ThisSiteP>
				実際の定義は次の通り。色を直接書かず、すべて CSS
				カスタムプロパティ経由にしている。
			</ThisSiteP>
			<pre>
				<code>{`@utility glass {
  border: 1px solid var(--line);
  background: linear-gradient(165deg, var(--surface-strong), var(--surface));
  backdrop-filter: blur(20px) saturate(1.4);
  -webkit-backdrop-filter: blur(20px) saturate(1.4);
  box-shadow:
    0 1px 0 var(--inset-glint) inset,
    0 22px 44px rgba(23, 58, 64, 0.1),
    0 6px 18px rgba(23, 58, 64, 0.08);
}`}</code>
			</pre>
			<ThisSiteP>
				呼び出し側は、たとえば <ThisSiteCode>Card</ThisSiteCode> の{" "}
				<ThisSiteCode>glass</ThisSiteCode> バリアントが{" "}
				<ThisSiteCode>"glass text-[var(--sea-ink)]"</ThisSiteCode>、
				<ThisSiteCode>Badge</ThisSiteCode> の <ThisSiteCode>glass</ThisSiteCode>{" "}
				バリアントが <ThisSiteCode>"glass text-[var(--kicker)]"</ThisSiteCode>
				というように、<ThisSiteCode>glass</ThisSiteCode>{" "}
				クラスに固有の文字色だけを足す形になっている。ガラスの見た目そのものを
				コンポーネント側で再定義することはない。
			</ThisSiteP>

			<ThisSiteH3>ハードコードした色を書かないことの効果</ThisSiteH3>
			<ThisSiteP>
				<ThisSiteCode>--surface</ThisSiteCode> /{" "}
				<ThisSiteCode>--surface-strong</ThisSiteCode> /{" "}
				<ThisSiteCode>--line</ThisSiteCode> /{" "}
				<ThisSiteCode>--inset-glint</ThisSiteCode> は{" "}
				<ThisSiteCode>:root</ThisSiteCode>
				（ライト）と <ThisSiteCode>.dark</ThisSiteCode>
				（ダーク）の両方で個別に定義されているCSS変数で、
				<ThisSiteCode>@utility glass</ThisSiteCode>{" "}
				側は変数名だけを参照している。実際の値は次の通り。
			</ThisSiteP>
			<div className="mt-4 grid gap-4 sm:grid-cols-2">
				<div className="rounded-xl border border-[var(--line)] p-4">
					<p className="island-kicker mb-2">Light (:root)</p>
					<ul className="space-y-1 font-mono text-xs text-[var(--sea-ink-soft)]">
						<li>--surface: rgba(219, 234, 254, 0.55)</li>
						<li>--surface-strong: rgba(191, 219, 254, 0.62)</li>
						<li>--line: rgba(59, 130, 246, 0.28)</li>
						<li>--inset-glint: rgba(255, 255, 255, 0.75)</li>
					</ul>
				</div>
				<div className="rounded-xl border border-[var(--line)] p-4">
					<p className="island-kicker mb-2">Dark (.dark)</p>
					<ul className="space-y-1 font-mono text-xs text-[var(--sea-ink-soft)]">
						<li>--surface: rgba(30, 58, 95, 0.55)</li>
						<li>--surface-strong: rgba(23, 46, 79, 0.68)</li>
						<li>--line: rgba(96, 165, 250, 0.28)</li>
						<li>--inset-glint: rgba(147, 197, 253, 0.16)</li>
					</ul>
				</div>
			</div>
			<ThisSiteP>
				この結果、コンポーネント側のコードに <ThisSiteCode>#fff</ThisSiteCode>{" "}
				や <ThisSiteCode>rgba(...)</ThisSiteCode>{" "}
				を一切書かなくても、ルート要素に付く <ThisSiteCode>.dark</ThisSiteCode>{" "}
				クラスの有無だけでガラス表現がライト/ダーク双方に自動的に対応する。
				色の切り替えロジックをコンポーネントごとに持つ必要がない、という設計になっている。
			</ThisSiteP>

			<ThisSiteH2>
				GitHub統計: 実データによる言語構成とフレームワーク検出
			</ThisSiteH2>
			<ThisSiteP>
				About ページと、このサイト自身の README
				的な位置づけであるここで表示している言語構成・フレームワーク利用状況は、
				<ThisSiteCode>scripts/generate-github-stats.mjs</ThisSiteCode>{" "}
				がビルド時ではなく手動実行のスクリプトとして事前生成した{" "}
				<ThisSiteCode>src/data/github-stats.json</ThisSiteCode>{" "}
				を読み込んでいるだけで、フロントエンドはただの静的レンダリングになっている。
			</ThisSiteP>
			<ThisSiteH3>集計方法: GitHub GraphQL API</ThisSiteH3>
			<ThisSiteP>
				スクリプトは <ThisSiteCode>gh api graphql</ThisSiteCode> 経由で GitHub
				の GraphQL API を叩き、対象アカウントの公開リポジトリを{" "}
				<ThisSiteCode>isFork: false</ThisSiteCode>{" "}
				で絞り込みつつ50件ずつページネーションして全件取得する。各リポジトリについて
				<ThisSiteCode>languages</ThisSiteCode>{" "}
				フィールド（サイズ降順で上位10言語）と、後述する3つの依存ファイルの中身を1回のクエリでまとめて取ってきている。
				取得後、<ThisSiteCode>isArchived</ThisSiteCode> と{" "}
				<ThisSiteCode>isTemplate</ThisSiteCode> のリポジトリは集計から除外する。
			</ThisSiteP>
			<ThisSiteH3>
				フレームワーク検出: descriptionの正規表現ではなく依存関係の実体
			</ThisSiteH3>
			<ThisSiteP>
				フレームワークの利用状況は、リポジトリの説明文（description）をキーワードでマッチさせるような推測ベースの方法は取っていない。代わりに
				GraphQL クエリの中で各リポジトリの{" "}
				<ThisSiteCode>HEAD:package.json</ThisSiteCode> /{" "}
				<ThisSiteCode>HEAD:Cargo.toml</ThisSiteCode> /{" "}
				<ThisSiteCode>HEAD:go.mod</ThisSiteCode> をそれぞれ{" "}
				<ThisSiteCode>object(expression: ...)</ThisSiteCode>{" "}
				で直接取得し、その中身を解析することで判定している。
			</ThisSiteP>
			<ThisSiteP>
				<ThisSiteCode>package.json</ThisSiteCode> は JSON としてパースし、
				<ThisSiteCode>dependencies</ThisSiteCode> と{" "}
				<ThisSiteCode>devDependencies</ThisSiteCode>{" "}
				を合わせたキー集合に対して、たとえば <ThisSiteCode>React</ThisSiteCode>{" "}
				なら <ThisSiteCode>"react"</ThisSiteCode>、
				<ThisSiteCode>TanStack Start</ThisSiteCode> なら{" "}
				<ThisSiteCode>"@tanstack/react-start"</ThisSiteCode> や{" "}
				<ThisSiteCode>"@tanstack/start"</ThisSiteCode>{" "}
				というように定義済みのパッケージ名リストが含まれているかを完全一致で見ている。
				<ThisSiteCode>Cargo.toml</ThisSiteCode> と{" "}
				<ThisSiteCode>go.mod</ThisSiteCode>{" "}
				は構造化パースはせず、テキストとして依存名の文字列が含まれるかを見る簡易な判定（
				<ThisSiteCode>Cargo.toml</ThisSiteCode>{" "}
				は改行+パッケージ名+スペースまたは
				<ThisSiteCode>=</ThisSiteCode>、<ThisSiteCode>go.mod</ThisSiteCode>{" "}
				はモジュールパスの部分一致）になっている。つまり、実際にそのリポジトリが依存として宣言しているものだけを数えており、READMEやdescriptionの記述内容には一切依存しない。
			</ThisSiteP>

			<ThisSiteH3>実際の集計結果</ThisSiteH3>
			<ThisSiteP>
				直近生成分（
				<ThisSiteCode>github-stats.json</ThisSiteCode> の{" "}
				<ThisSiteCode>generatedAt</ThisSiteCode>
				）の数値。About ページと同じデータソースを使っている。
			</ThisSiteP>
			<ul className="mt-3 divide-y-0">
				<ThisSiteStatRow
					label="集計対象リポジトリ数"
					value="209"
					detail="fork/archived/template除外後"
				/>
				<ThisSiteStatRow label="最多言語" value="TypeScript" detail="55.1%" />
				<ThisSiteStatRow label="2位" value="Rust" detail="21.0%" />
				<ThisSiteStatRow label="3位" value="Python" detail="5.0%" />
				<ThisSiteStatRow
					label="最多利用フレームワーク"
					value="Serde"
					detail="27リポジトリ"
				/>
				<ThisSiteStatRow label="2位" value="React" detail="24リポジトリ" />
				<ThisSiteStatRow
					label="3位"
					value="Tailwind CSS"
					detail="21リポジトリ"
				/>
			</ul>
			<ThisSiteP>
				生成日時と正確な数値は <a href="/about">About ページ</a>{" "}
				に常に最新のものが表示される（このスクリプトはビルドパイプラインには組み込まれておらず、手動実行で
				<ThisSiteCode>src/data/github-stats.json</ThisSiteCode>{" "}
				を更新する運用になっている）。
			</ThisSiteP>

			<ThisSiteH2>Lighthouse / Core Web Vitals 実測値</ThisSiteH2>
			<ThisSiteP>
				本番相当のビルド（<ThisSiteCode>pnpm run build</ThisSiteCode> →{" "}
				<ThisSiteCode>pnpm run preview</ThisSiteCode>
				）に対して、Chrome ヘッドレスで Lighthouse
				を実行して計測した。計測環境は開発用サンドボックス内のコンテナで、
				実運用のデプロイ先（Cloudflare Workers、#11
				完了後）とはネットワーク条件が異なる点に注意。
			</ThisSiteP>
			<ul className="mt-3">
				<ThisSiteStatRow label="Performance" value="89" detail="/ 100" />
				<ThisSiteStatRow label="Accessibility" value="95" detail="/ 100" />
				<ThisSiteStatRow label="Best Practices" value="96" detail="/ 100" />
				<ThisSiteStatRow label="SEO" value="100" detail="/ 100" />
				<ThisSiteStatRow label="LCP" value="0.8 s" />
				<ThisSiteStatRow label="CLS" value="0" />
				<ThisSiteStatRow label="TBT" value="0 ms" />
				<ThisSiteStatRow label="FCP" value="0.8 s" />
				<ThisSiteStatRow label="Speed Index" value="7.8 s" detail="※下記参照" />
			</ul>
			<ThisSiteP>
				Performance / SEO は満点近くで、LCP・CLS・TBT・FCP
				はいずれも良好な値になった。一方で Speed Index
				だけ突出して悪い（7.8秒）。原因を Lighthouse
				のコンソールログで確認したところ、このサンドボックス環境のプロキシがヘッドレス
				Chrome からの <ThisSiteCode>fonts.googleapis.com</ThisSiteCode>{" "}
				へのリクエストを <ThisSiteCode>ERR_CONNECTION_RESET</ThisSiteCode>{" "}
				で落としており、Web
				フォント（Fraunces・Manrope）の読み込みがタイムアウトするまでレンダリングが足踏みしていたことが原因だった。実際のデプロイ先（Cloudflare
				Workers 経由の本番環境）ではこの制約は無いため、Speed Index
				の値はこのサンドボックス特有のものであり、本番の実測値ではない点は正直に書いておく。
			</ThisSiteP>
			<ThisSiteP>
				アクセシビリティスコアが100点ではない理由も具体的に特定できていて、Lighthouse
				の <ThisSiteCode>color-contrast</ThisSiteCode>{" "}
				監査がヘッダーのサイトロゴリンク（コントラスト比 4.31:1、要求は 4.5:1
				以上）を指摘している。これはこの記事のページに限らず全ページ共通のヘッダーコンポーネントの問題で、この
				Issue の範囲外だが実測結果としてそのまま記載する。Best Practices
				が96点なのは、favicon.ico
				が未設定でリクエストが404になっていること（同じくサイト全体の既存の問題）が理由。
			</ThisSiteP>

			<ThisSiteH2>アクセシビリティ確認</ThisSiteH2>
			<ThisSiteH3>キーボード操作</ThisSiteH3>
			<ThisSiteP>
				GUI ブラウザの無いサンドボックス環境のため、実際に Tab
				キーを押しての目視によるフォーカス移動確認は行えなかった。代わりに
				Lighthouse
				のアクセシビリティ監査に含まれる決定的なキーボード関連チェック（フォーカス可能性・論理的なタブ順序・ARIAロール整合性・フォーカストラップの有無）をすべて自動実行し、いずれも合格したことを確認している。実機での目視確認は{" "}
				[TODO: 本人記入]。
			</ThisSiteP>
			<ThisSiteH3>コントラスト比</ThisSiteH3>
			<ThisSiteP>
				WCAG
				のコントラスト計算式で、このページ本文が使っている色の組み合わせを実際に計算した。
			</ThisSiteP>
			<ul className="mt-3">
				<ThisSiteStatRow
					label="本文 (--sea-ink) / 背景 (--bg-base) ライト"
					value="10.6 : 1"
				/>
				<ThisSiteStatRow
					label="補助テキスト (--sea-ink-soft) / 背景 ライト"
					value="5.58 : 1"
				/>
				<ThisSiteStatRow
					label="リンク色 (--lagoon-deep) / 背景 ライト"
					value="4.59 : 1"
				/>
				<ThisSiteStatRow
					label="本文 (--sea-ink) / 背景 (--bg-base) ダーク"
					value="15.4 : 1"
				/>
				<ThisSiteStatRow
					label="補助テキスト (--sea-ink-soft) / 背景 ダーク"
					value="10.14 : 1"
				/>
				<ThisSiteStatRow
					label="リンク色 (--lagoon-deep) / 背景 ダーク"
					value="10.21 : 1"
				/>
			</ul>
			<ThisSiteP>
				本文・補助テキスト・リンク色は、ライト/ダークいずれも WCAG AA
				の通常テキスト基準（4.5:1）を満たしている。ただし上で書いた通り、ヘッダーのロゴリンクだけはライトモードで
				4.31:1 と基準をわずかに下回っており、Lighthouse
				の自動監査と手計算の両方で同じ結果になった。この修正はヘッダーコンポーネント側の変更が必要なため、この
				Issue の範囲では実測結果として記録するにとどめる。
			</ThisSiteP>
			<ThisSiteH3>スクリーンリーダー</ThisSiteH3>
			<ThisSiteP>[TODO: 本人記入]</ThisSiteP>
		</article>
	);
}

export const workBodies: Partial<Record<string, () => ReactNode>> = {
	"this-site": ThisSiteBody,
	"tauri-invoke-binding": TauriInvokeBindingBody,
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
