import { relations, sql } from "drizzle-orm";
import { text, sqliteTable, unique, int } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
});

export const usersRelations = relations(users, ({ many }) => ({
  chatbots: many(chatbots),
  settings: many(userSettings),
  sessions: many(sessions),
}));

export const userSettings = sqliteTable(
  "user_settings",
  {
    id: text("id").notNull(),
    value: text("value").notNull(),
    valueType: text("valueType", {
      enum: ["string", "int", "float"],
    })
      .notNull()
      .default("string"),
    category: text("category"),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (t) => ({
    unq: unique().on(t.userId, t.id),
  }),
);

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(users, {
    fields: [userSettings.userId],
    references: [users.id],
  }),
}));

export const chatbots = sqliteTable(
  "chatbots",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text("name").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`)
      .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  },
  (t) => ({
    unq: unique().on(t.userId, t.name),
  }),
);

export const chatbotsRelations = relations(chatbots, ({ one, many }) => ({
  user: one(users, {
    fields: [chatbots.userId],
    references: [users.id],
  }),
  settings: many(chatbotSettings),
  sessions: many(sessions),
}));

export const chatbotSettings = sqliteTable(
  "chatbot_settings",
  {
    id: text("id").notNull(),
    value: text("value").notNull(),
    valueType: text("valueType", {
      enum: ["string", "int", "float"],
    })
      .notNull()
      .default("string"),
    category: text("category"),
    chatbotId: text("chatbot_id")
      .notNull()
      .references(() => chatbots.id, { onDelete: "cascade" }),
  },
  (t) => ({
    unq: unique().on(t.chatbotId, t.id),
  }),
);

export const chatbotSettingsRelations = relations(
  chatbotSettings,
  ({ one }) => ({
    chatbot: one(chatbots, {
      fields: [chatbotSettings.chatbotId],
      references: [chatbots.id],
    }),
  }),
);

export const sessions = sqliteTable(
  "chatbot_sessions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    chatbotId: text("chatbot_id")
      .notNull()
      .references(() => chatbots.id, { onDelete: "cascade" }),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
    messages: text("messages").notNull(),
    duration: int("duration").notNull(),
    accessToken: text("access_token").notNull(),
  },

)

export const sessionsRelations = relations(sessions, ({ one }) => ({
  chatbot: one(chatbots, {
    fields: [sessions.chatbotId],
    references: [chatbots.id],
  }),
}));