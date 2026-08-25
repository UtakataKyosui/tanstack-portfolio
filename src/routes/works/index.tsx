import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "#/components/ui/badge.tsx";
import { Card } from "#/components/ui/card.tsx";
import { lifeSystems } from "#/data/life-systems.ts";
import { WORK_CATEGORY_LABELS, works } from "#/data/works.ts";

// loader が無く、data/works.ts の静的配列を直接 map しているだけなので、
// router の defaultSsr: false（CSR）をそのまま使う。
export const Route = createFileRoute("/works/")({
	component: WorksIndex,
});

function WorksIndex() {
	return (
		<main className="page-wrap px-4 py-12">
			<section className="island-shell rounded-2xl p-6 sm:p-8">
				<p className="island-kicker mb-2">Works</p>
				<h1 className="display-title mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
					作ってきたもの。
				</h1>
				<p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
					「気をつける」を仕組みに変えてきた、いくつかの作品。
				</p>
			</section>

			<section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{works.map((work, index) => (
					<Link
						key={work.slug}
						to="/works/$slug"
						params={{ slug: work.slug }}
						className="no-underline"
					>
						<Card
							variant="glass"
							className="rise-in h-full gap-3 rounded-2xl p-5"
							style={{ animationDelay: `${index * 90 + 80}ms` }}
						>
							<div className="flex flex-wrap items-center gap-1.5">
								<Badge
									variant="glass"
									className="w-fit rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.12em]"
								>
									{WORK_CATEGORY_LABELS[work.category]}
								</Badge>
								{work.demoUrl && (
									<Badge
										variant="glass"
										className="w-fit gap-1 rounded-full border-[var(--lagoon-deep)] px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[var(--lagoon-deep)]"
									>
										<span
											className="size-1.5 rounded-full"
											style={{ backgroundColor: "var(--lagoon-deep)" }}
										/>
										Live
									</Badge>
								)}
							</div>
							<h2 className="m-0 text-lg font-semibold text-[var(--sea-ink)]">
								{work.title}
							</h2>
							<p className="m-0 text-sm text-[var(--sea-ink-soft)]">
								{work.summary}
							</p>
							<div className="mt-auto flex flex-wrap gap-1.5 pt-2">
								{work.tech.map((tech) => (
									<span
										key={tech}
										className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-2 py-0.5 text-xs text-[var(--sea-ink-soft)]"
									>
										{tech}
									</span>
								))}
							</div>
						</Card>
					</Link>
				))}
			</section>

			<section className="mt-14">
				<div className="island-shell rounded-2xl p-6 sm:p-8">
					<p className="island-kicker mb-2">Life Systems</p>
					<h2 className="display-title mb-3 text-2xl font-bold text-[var(--sea-ink)] sm:text-3xl">
						生活を仕組みにしたもの。
					</h2>
					<p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
						これらは全て、日常の反復作業を自動化・仕組み化したツールである。
						薬を飲む時間、服の組み合わせ、部屋の片付け、サブスクの契約、作業の区切り、
						ディスクの空き容量、cron
						ジョブ、個人開発の進捗管理——対象は毎回バラバラだが、
						「都度気をつける」のではなく「仕組みが代わりにやる」という形にしている点は共通している。
					</p>
					<p className="m-0 mt-4 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
						[TODO: 本人記入]
					</p>
				</div>

				<div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{lifeSystems.map((entry, index) => (
						<a
							key={entry.slug}
							href={entry.repoUrl}
							target="_blank"
							rel="noreferrer"
							className="no-underline"
						>
							<Card
								variant="glass"
								className="rise-in h-full gap-3 rounded-2xl p-5"
								style={{ animationDelay: `${index * 90 + 80}ms` }}
							>
								<h3 className="m-0 text-lg font-semibold text-[var(--sea-ink)]">
									{entry.title}
								</h3>
								<p className="m-0 text-sm text-[var(--sea-ink-soft)]">
									{entry.summary}
								</p>
								<span className="mt-auto pt-2 text-xs text-[var(--sea-ink-soft)]">
									Repository ↗
								</span>
							</Card>
						</a>
					))}
				</div>
			</section>
		</main>
	);
}
