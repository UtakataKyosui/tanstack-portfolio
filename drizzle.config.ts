import { defineConfig } from "drizzle-kit";

// スキーマから SQL マイグレーションファイルを生成するためだけに使う。
// D1 への適用は wrangler d1 migrations apply が行うため driver は指定しない。
export default defineConfig({
	dialect: "sqlite",
	schema: "./src/db/schema.ts",
	// wrangler d1 migrations apply は既定で ./migrations を見るため合わせる。
	out: "./migrations",
});
