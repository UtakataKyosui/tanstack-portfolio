import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema.ts";

export async function getDb() {
	const { env } = await import("cloudflare:workers");
	return drizzle((env as Env).DB, { schema });
}
