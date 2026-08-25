import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BlockRenderer } from "#/components/blocks/index.ts";
import { StrapiImage } from "#/components/StrapiImage.tsx";
import { Badge } from "#/components/ui/badge.tsx";
import { Card } from "#/components/ui/card.tsx";
import { strapiApi } from "#/data/loaders/index.ts";

export const Route = createFileRoute("/writing/$slug")({
	component: WritingDetail,
	loader: async ({ params }) => {
		const response = await strapiApi.articles.getArticleBySlugData({
			data: params.slug,
		});
		const article = response.data[0];
		if (!article) {
			throw notFound();
		}
		return article;
	},
	errorComponent: WritingDetailError,
	// 記事詳細ページは works/$slug と同様に SEO/OGP を意識したいが、loader が
	// 外部（Strapi）へのネットワークフェッチを伴う点が works と異なる。
	// Strapi 未接続時に SSR がエラーで落ちるとページ全体が壊れるため、
	// ここでは data-only（defaultSsr: false）のままにし、Strapi 接続が
	// 安定してから ssr: true への切り替えを検討する。
});

function WritingDetailError() {
	return (
		<main className="page-wrap px-4 py-12">
			<Link
				to="/writing"
				className="mb-6 inline-block text-sm text-[var(--sea-ink-soft)] no-underline hover:text-[var(--sea-ink)]"
			>
				&larr; Writing 一覧に戻る
			</Link>
			<section className="island-shell rounded-2xl p-6 sm:p-8">
				<h1 className="mb-2 text-xl font-semibold text-[var(--sea-ink)]">
					記事を読み込めませんでした
				</h1>
				<p className="m-0 text-sm text-[var(--sea-ink-soft)]">
					Strapi
					サーバーに接続できませんでした。準備が完了次第、記事が表示されます。
				</p>
			</section>
		</main>
	);
}

function WritingDetail() {
	const article = Route.useLoaderData();

	return (
		<main className="page-wrap px-4 py-12">
			<Link
				to="/writing"
				className="mb-6 inline-block text-sm text-[var(--sea-ink-soft)] no-underline hover:text-[var(--sea-ink)]"
			>
				&larr; Writing 一覧に戻る
			</Link>

			<article>
				<Card variant="glass" className="overflow-hidden rounded-2xl p-0">
					<StrapiImage
						src={article.cover?.url}
						alt={article.cover?.alternativeText || article.title}
						className="h-64 w-full"
					/>
					<div className="p-6 sm:p-8">
						{article.category?.name && (
							<Badge
								variant="glass"
								className="mb-3 w-fit rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.12em]"
							>
								{article.category.name}
							</Badge>
						)}
						<h1 className="display-title mb-3 text-3xl font-bold text-[var(--sea-ink)] sm:text-4xl">
							{article.title}
						</h1>
						<div className="mb-6 flex items-center gap-4 text-sm text-[var(--sea-ink-soft)]">
							{article.author?.name && <span>By {article.author.name}</span>}
							{article.createdAt && (
								<span>
									{new Date(article.createdAt).toLocaleDateString("ja-JP", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</span>
							)}
						</div>
						{article.description && (
							<p className="mb-8 text-lg leading-relaxed text-[var(--sea-ink-soft)]">
								{article.description}
							</p>
						)}
						{article.blocks && article.blocks.length > 0 && (
							<BlockRenderer blocks={article.blocks} />
						)}
					</div>
				</Card>
			</article>
		</main>
	);
}
