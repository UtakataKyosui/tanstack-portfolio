import { strapi } from "@strapi/client";
import { getStrapiURL } from "#/lib/strapi-utils.ts";

export const sdk = strapi({ baseURL: new URL("/api", getStrapiURL()).href });
