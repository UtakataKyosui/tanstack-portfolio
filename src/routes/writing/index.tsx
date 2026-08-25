import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { Pagination } from "#/components/Pagination.tsx";
import { Search } from "#/components/Search.tsx";
import { StrapiImage } from "#/components/StrapiImage.tsx";
import { Badge } from "#/components/ui/badge.tsx";
import { Card } from "#/components/ui/card.tsx";
import { strapiApi } from "#/data/loaders/index.ts";
import type { TArticle } from "#/types/strapi.ts";

type LoaderResult =
	| {
			status: "success";
			articles: TArticle[];
			page: number;
			pageCount: number;
			query?: string;
	  }
	| { status: "empty"; query?: string }
	| { status: "error"; error: string; query?: string };

const searchSchema = z.object({
	query: z.string().optional(),
	page: z.number().default(1),
});

export const Route = createFileRoute("/writing/")({
	component: WritingIndex,
	validateSearch: searchSchema,
	loaderDeps: ({ search }) => ({ search }),
	loader: async ({ deps }): Promise<LoaderResult> => {
		const { query, page } = deps.search;
		try {
			const response = await strapiApi.articles.getArticlesData({
				data: { query, page },
			});
			if (!response?.data || response.data.length === 0) {
				return { status: "empty", query };
			}
			return {
				status: "success",
				articles: response.data,
				page: response.meta?.pagination?.page ?? page,
				pageCount: response.meta?.pagination?.pageCount ?? 1,
				query,
			};
		} catch (error) {
			return {
				status: "error",
				error:
					error instanceof Error
						? error.message
						: "Failed to connect to Strapi",
				query,
			};
		}
	},
	// Strapi サーバーが常時起動しているとは限らず、loader は外部フェッチを
	// 伴うため、works/index と異なりここでは SSR を選ばない
	// (defaultSsr: false のまま)。接続エラー時に SSR で失敗すると
	// ページ全体が壊れるリスクがあるため。
});

function WritingIndex() {
	const result = Route.useLoaderData();

	return (
		<main className="page-wrap px-4 py-12">
			<section className="island-shell rounded-2xl p-6 sm:p-8">
				<p className="island-kicker mb-2">Writing</p>
				<h1 className="display-title mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
					書いてきたもの。
				</h1>
				<p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
					技術的な気づきや取り組みの記録。
				</p>
				<div className="mt-6">
					<Search initialQuery={result.query} />
				</div>
			</section>

			{result.status === "error" && (
				<section className="island-shell mt-8 rounded-2xl p-6 sm:p-8">
					<h2 className="mb-2 text-xl font-semibold text-[var(--sea-ink)]">
						記事を読み込めませんでした
					</h2>
					<p className="m-0 text-sm text-[var(--sea-ink-soft)]">
						Strapi
						サーバーに接続できませんでした。準備が完了次第、記事が表示されます。
					</p>
					<p className="mt-2 text-xs text-[var(--sea-ink-soft)]">
						Error: {result.error}
					</p>
				</section>
			)}

			{result.status === "empty" && (
				<section className="island-shell mt-8 rounded-2xl p-6 sm:p-8">
					<h2 className="mb-2 text-xl font-semibold text-[var(--sea-ink)]">
						{result.query
							? "該当する記事が見つかりませんでした"
							: "まだ記事がありません"}
					</h2>
				</section>
			)}

			{result.status === "success" && (
				<>
					<section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{result.articles.map((article, index) => (
							<Link
								key={article.id}
								to="/writing/$slug"
								params={{ slug: article.slug }}
								className="no-underline"
							>
								<Card
									variant="glass"
									className="rise-in h-full gap-3 overflow-hidden rounded-2xl p-0"
									style={{ animationDelay: `${index * 90 + 80}ms` }}
								>
									<StrapiImage
										src={article.cover?.url}
										alt={article.cover?.alternativeText || article.title}
										className="h-40 w-full"
									/>
									<div className="flex flex-1 flex-col gap-2 p-5">
										{article.category?.name && (
											<Badge
												variant="glass"
												className="w-fit rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.12em]"
											>
												{article.category.name}
											</Badge>
										)}
										<h2 className="m-0 text-lg font-semibold text-[var(--sea-ink)]">
											{article.title}
										</h2>
										{article.description && (
											<p className="m-0 line-clamp-2 text-sm text-[var(--sea-ink-soft)]">
												{article.description}
											</p>
										)}
										<div className="mt-auto flex items-center justify-between pt-2 text-xs text-[var(--sea-ink-soft)]">
											{article.author?.name && (
												<span>By {article.author.name}</span>
											)}
											{article.createdAt && (
												<span>
													{new Date(article.createdAt).toLocaleDateString()}
												</span>
											)}
										</div>
									</div>
								</Card>
							</Link>
						))}
					</section>

					{result.pageCount > 1 && (
						<div className="mt-8">
							<Pagination
								currentPage={result.page}
								pageCount={result.pageCount}
							/>
						</div>
					)}
				</>
			)}
		</main>
	);
}
