import { getArticleBySlugData, getArticlesData } from "./articles.ts";

/**
 * Strapi API - Server functions for fetching data from Strapi
 *
 * Usage in route loaders:
 * ```ts
 * import { strapiApi } from "#/data/loaders/index.ts";
 *
 * export const Route = createFileRoute("/writing/")({
 *   loader: async () => {
 *     const { data, meta } = await strapiApi.articles.getArticlesData();
 *     return data;
 *   },
 * });
 * ```
 */
export const strapiApi = {
	articles: {
		getArticlesData,
		getArticleBySlugData,
	},
};
