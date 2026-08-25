import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const articles = sqliteTable("articles", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	title: text("title").notNull(),
	slug: text("slug").notNull().unique(),
	description: text("description"),
	body: text("body").notNull(),
	status: text("status", { enum: ["draft", "published"] })
		.notNull()
		.default("draft"),
	publishedAt: integer("published_at", { mode: "timestamp" }),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`)
		.$onUpdate(() => new Date()),
});

export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
