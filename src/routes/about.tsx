import { createFileRoute } from "@tanstack/react-router";
import { TechIcon } from "#/components/TechIcon.tsx";
import { Card } from "#/components/ui/card.tsx";
import githubStats from "#/data/github-stats.json";
import { languageColor } from "#/data/language-colors.ts";

// loader は無く、github-stats.json を静的 import しているだけ
// （ビルド時にバンドルへ同梱される）なので、router の
// defaultSsr: false（CSR）をそのまま使う。
export const Route = createFileRoute("/about")({
	component: About,
});

const TOP_LANGUAGES = githubStats.languages.slice(0, 6);
const TOP_FRAMEWORKS = githubStats.frameworks.slice(0, 8);
const MAX_FRAMEWORK_REPOS = TOP_FRAMEWORKS[0]?.repoCount ?? 1;

const GITHUB_URL = "https://github.com/UtakataKyosui";

/**
 * TODOプレースホルダー用の見た目。本人が本文を書き込むまで、
 * 公開ページ上で一目でTODOだとわかるように破線ボーダー＋警告色を当てている。
 */
function TodoPlaceholder({
	label,
	className = "",
	as: Tag = "p",
}: {
	label: string;
	className?: string;
	as?: "p" | "span" | "div";
}) {
	return (
		<Tag
			className={`m-0 inline-block rounded-lg border border-dashed border-amber-500/70 bg-amber-500/10 px-4 py-3 text-sm font-medium text-amber-600 dark:text-amber-400 ${className}`}
		>
			[TODO: 本人記入] {label}
		</Tag>
	);
}

function About() {
	return (
		<main className="page-wrap px-4 py-12">
			<section className="island-shell rounded-2xl p-6 sm:p-8">
				<p className="island-kicker mb-2">About</p>
				<h1 className="display-title mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
					<TodoPlaceholder as="span" label="見出し（一人称の名乗り）" />
				</h1>
				<div className="max-w-3xl space-y-3">
					<TodoPlaceholder label="リード文（自己紹介）" />
					<TodoPlaceholder label="なぜフロントエンドをやっているのか、何が楽しいのか" />
					<TodoPlaceholder label="「気をつける」を仕組みに変える、という名乗りに至った経緯" />
				</div>
			</section>

			<section className="mt-8 grid gap-4 sm:grid-cols-2">
				<Card variant="glass" className="rounded-2xl p-6">
					<p className="island-kicker mb-4">Most Used Languages</p>
					<div className="mb-4 flex h-3 w-full overflow-hidden rounded-full bg-[var(--line)]">
						{TOP_LANGUAGES.map((lang) => (
							<div
								key={lang.name}
								style={{
									width: `${lang.percent}%`,
									backgroundColor: languageColor(lang.name),
								}}
							/>
						))}
					</div>
					<ol className="space-y-2">
						{TOP_LANGUAGES.map((lang, index) => (
							<li key={lang.name} className="flex items-center gap-3 text-sm">
								<span className="w-4 text-right font-mono text-xs text-[var(--sea-ink-soft)]">
									{index + 1}
								</span>
								<TechIcon name={lang.name} />
								<span className="flex-1 font-medium text-[var(--sea-ink)]">
									{lang.name}
								</span>
								<span className="text-[var(--sea-ink-soft)]">
									{lang.percent}%
								</span>
							</li>
						))}
					</ol>
				</Card>

				<Card variant="glass" className="rounded-2xl p-6">
					<p className="island-kicker mb-4">Most Used Frameworks</p>
					<ol className="space-y-3">
						{TOP_FRAMEWORKS.map((fw, index) => (
							<li key={fw.name} className="text-sm">
								<div className="mb-1 flex items-center gap-3">
									<span className="w-4 text-right font-mono text-xs text-[var(--sea-ink-soft)]">
										{index + 1}
									</span>
									<TechIcon name={fw.name} />
									<span className="flex-1 font-medium text-[var(--sea-ink)]">
										{fw.name}
									</span>
									<span className="text-[var(--sea-ink-soft)]">
										{fw.repoCount} repos
									</span>
								</div>
								<div className="ml-7 h-1.5 overflow-hidden rounded-full bg-[var(--line)]">
									<div
										className="h-full rounded-full bg-[var(--lagoon-deep)]"
										style={{
											width: `${Math.round((fw.repoCount / MAX_FRAMEWORK_REPOS) * 100)}%`,
										}}
									/>
								</div>
							</li>
						))}
					</ol>
				</Card>
			</section>

			<p className="mt-4 text-xs text-[var(--sea-ink-soft)]">
				Based on {githubStats.repoCount} public GitHub repositories, last
				generated {new Date(githubStats.generatedAt).toLocaleDateString()}.
			</p>

			<section className="island-shell mt-8 rounded-2xl p-6 sm:p-8">
				<p className="island-kicker mb-4">Writing</p>

				{/*
				 * UtakataTechBooks について: GitHub上でユーザー/組織としての実在を
				 * 検索で確認したが、該当アカウントは見つからなかった（2026-08-24 時点）。
				 * そのため公開情報として書ける事実が無く、リンク先を仮に置くことは
				 * 事実の捏造になるため置いていない。本人が実在するアカウント名・URLを
				 * 確認でき次第、下記の TODO を実データに差し替えること。
				 */}
				<div className="space-y-3">
					<TodoPlaceholder label="技術書典で出す本について（サークル名・本のタイトル・内容）。UtakataTechBooks というGitHubアカウント/組織はGitHub検索では見つからなかったため、実在するリンクを本人が確認して差し替えること" />
					<TodoPlaceholder label="Zenn / ブログ記事へのリンクを載せるか。載せる場合は下記の選択肢から本人が決めて記入する: (1) Zennプロフィールへのリンクのみ掲載 (2) 個別記事を抜粋して掲載 (3) 当面は載せない" />
				</div>
			</section>

			<section className="island-shell mt-8 rounded-2xl p-6 sm:p-8">
				<p className="island-kicker mb-4">Contact</p>

				<div className="mb-4 flex flex-wrap gap-3">
					<a
						href={GITHUB_URL}
						target="_blank"
						rel="noreferrer noopener"
						className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--sea-ink)] transition-colors hover:border-[var(--lagoon-deep)]"
					>
						GitHub: UtakataKyosui
					</a>
				</div>

				<div className="space-y-3">
					<TodoPlaceholder label="SNS（X/Twitter, Bluesky など）を載せるか。Header/Footerから TanStack公式リンクは削除済みで、現在SNSリンクは無い状態。載せる場合はアカウントURLを本人が記入する" />
					<TodoPlaceholder label="連絡手段をどこまで公開するか（例: メールアドレスを載せる／載せない、DMのみ受け付ける、フォームを用意する、など）を本人が決めて記入する" />
				</div>
			</section>
		</main>
	);
}
