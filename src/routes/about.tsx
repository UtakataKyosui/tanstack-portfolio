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

function About() {
	return (
		<main className="page-wrap px-4 py-12">
			<section className="island-shell rounded-2xl p-6 sm:p-8">
				<p className="island-kicker mb-2">About</p>
				<h1 className="display-title mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
					A small starter with room to grow.
				</h1>
				<p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
					This site keeps things light: type-safe routing, server-backed data
					fetching, and modern rendering defaults. Use this as a clean
					foundation, then layer in your own routes, styling, and add-ons.
				</p>
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
		</main>
	);
}
