import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const messageTable = pgTable("message", {
  id: uuid().primaryKey().defaultRandom(),
  content: text().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});
