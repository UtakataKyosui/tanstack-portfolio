import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Badge } from "#/components/ui/badge.tsx";
import { Card } from "#/components/ui/card.tsx";
import { getWorkBySlug, WORK_CATEGORY_LABELS } from "#/data/works.ts";
import { workBodies } from "#/data/works-content.tsx";

export const Route = createFileRoute("/works/$slug")({
	component: WorkDetail,
	loader: ({ params }) => {
		const work = getWorkBySlug(params.slug);
		if (!work) {
			throw notFound();
		}
		return work;
	},
	// ポートフォリオの作品詳細ページは検索エンジンや SNS カードに本文が
	// 見えてほしい（SEO / OGP 目的）ため、data-only ではなく HTML 自体を
	// サーバーで組み立てる true を選ぶ。loader 自体はメモリ上の配列参照の
	// みで外部フェッチが無く軽量なので、SSR のコストは小さい。
	ssr: true,
});

function WorkDetail() {
	const work = Route.useLoaderData();
	const Body = workBodies[work.slug];

	return (
		<main className="page-wrap px-4 py-12">
			<Link
				to="/works"
				className="mb-6 inline-block text-sm text-[var(--sea-ink-soft)] no-underline hover:text-[var(--sea-ink)]"
			>
				&larr; Works 一覧に戻る
			</Link>

			<section className="island-shell rounded-2xl p-6 sm:p-8">
				<Badge
					variant="glass"
					className="mb-3 w-fit rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.12em]"
				>
					{WORK_CATEGORY_LABELS[work.category]}
				</Badge>
				<h1 className="display-title mb-3 text-3xl font-bold text-[var(--sea-ink)] sm:text-4xl">
					{work.title}
				</h1>
				<p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
					{work.summary}
				</p>

				<div className="mt-4 flex flex-wrap gap-1.5">
					{work.tech.map((tech) => (
						<span
							key={tech}
							className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-2 py-0.5 text-xs text-[var(--sea-ink-soft)]"
						>
							{tech}
						</span>
					))}
				</div>

				<div className="mt-6 flex flex-wrap gap-3">
					{work.repoUrl && (
						<a
							href={work.repoUrl}
							target="_blank"
							rel="noreferrer"
							className="nav-link"
						>
							Repository ↗
						</a>
					)}
					{work.demoUrl && (
						<a
							href={work.demoUrl}
							target="_blank"
							rel="noreferrer"
							className="nav-link"
						>
							Demo ↗
						</a>
					)}
				</div>
			</section>

			<Card variant="glass" className="mt-8 rounded-2xl p-6 sm:p-8">
				{Body ? (
					<Body />
				) : (
					<p className="m-0 text-sm text-[var(--sea-ink-soft)]">
						この作品についての詳しい記事は準備中です。
					</p>
				)}
			</Card>
		</main>
	);
}
