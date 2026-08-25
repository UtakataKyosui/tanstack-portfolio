import { env } from "#/env.ts";

const DEFAULT_STRAPI_URL = "http://localhost:1337";

export function getStrapiURL(): string {
	return env.VITE_STRAPI_URL ?? DEFAULT_STRAPI_URL;
}

export function getStrapiMedia(url: string | undefined | null): string {
	if (!url) return "";
	if (
		url.startsWith("data:") ||
		url.startsWith("http") ||
		url.startsWith("//")
	) {
		return url;
	}
	const baseUrl = getStrapiURL();
	return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
}
