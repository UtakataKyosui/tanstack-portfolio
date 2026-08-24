import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "#/components/ui/badge.tsx";
import { Card } from "#/components/ui/card.tsx";
import { WORK_CATEGORY_LABELS, works } from "#/data/works.ts";

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
							<Badge
								variant="glass"
								className="w-fit rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.12em]"
							>
								{WORK_CATEGORY_LABELS[work.category]}
							</Badge>
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
		</main>
	);
}
