import { createServerFn } from "@tanstack/react-start";
import { sdk } from "#/data/strapi-sdk.ts";
import type { TArticle, TStrapiResponseCollection } from "#/types/strapi.ts";

const PAGE_SIZE = 10;

const articles = sdk.collection("articles");

async function getArticles(page?: number, query?: string) {
	const filters = query
		? {
				$or: [
					{ title: { $containsi: query } },
					{ description: { $containsi: query } },
				],
			}
		: undefined;

	return articles.find({
		sort: ["createdAt:desc"],
		pagination: {
			page: page || 1,
			pageSize: PAGE_SIZE,
		},
		populate: ["cover", "author", "category"],
		filters,
	}) as Promise<TStrapiResponseCollection<TArticle>>;
}

async function getArticleBySlug(slug: string) {
	return articles.find({
		filters: {
			slug: { $eq: slug },
		},
		populate: ["cover", "author", "category", "blocks.file", "blocks.files"],
	}) as Promise<TStrapiResponseCollection<TArticle>>;
}

export const getArticlesData = createServerFn({
	method: "GET",
})
	.validator((input?: { page?: number; query?: string }) => input)
	.handler(async ({ data }): Promise<TStrapiResponseCollection<TArticle>> => {
		return getArticles(data?.page, data?.query);
	});

export const getArticleBySlugData = createServerFn({
	method: "GET",
})
	.validator((slug: string) => slug)
	.handler(
		async ({ data: slug }): Promise<TStrapiResponseCollection<TArticle>> => {
			return getArticleBySlug(slug);
		},
	);
