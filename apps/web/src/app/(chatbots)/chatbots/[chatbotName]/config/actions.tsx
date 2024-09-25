"use server";

import { db } from "@/db";
import { chatbots, chatbotSettings } from "@/db/schema";
import { env } from "@/env.mjs";
import { CONFIG_SETTINGS } from "@/lib/settings";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function saveChatbotSettings(
  upserts: Partial<CONFIG_SETTINGS>,
  chatbotName: string,
  category: string,
) {
  const user = await currentUser();
  if (!user) redirect("/signin");

  // TODO: Skip this query and just use the given id
  const chatbot = await db.query.chatbots.findFirst({
    where: and(eq(chatbots.name, chatbotName), eq(chatbots.userId, user.id)),
    columns: {
      id: true,
    },
  });
  if (!chatbot) throw new Error("Chatbot not found");

  const values = Object.entries(upserts).map(([id, value]) => ({
    id,
    value: value?.toString() ?? "",
    chatbotId: chatbot.id,
    category,
  }));

  const toDelete = values.filter((v) => v.value === "");
  const toUpsert = values.filter((v) => v.value !== "");

  if (toDelete.length > 0) {
    await db
      .delete(chatbotSettings)
      .where(
        and(
          eq(chatbotSettings.chatbotId, chatbot.id),
          sql`id IN (${toDelete.map((v) => v.id)})`,
        ),
      );
  }

  if (toUpsert.length > 0) {
    await db
      .insert(chatbotSettings)
      .values(toUpsert)
      .onConflictDoUpdate({
        target: [chatbotSettings.id, chatbotSettings.chatbotId],
        set: {
          value: sql.raw(`excluded.${chatbotSettings.value.name}`),
        },
      });
  }
}

export async function saveSecret(
  value: string,
  company: string,
  configType: string,
  chatbotName: string,
) {
  const user = await currentUser();
  if (!user) redirect("/signin");

  const chatbot = await db.query.chatbots.findFirst({
    where: and(eq(chatbots.name, chatbotName), eq(chatbots.userId, user.id)),
    columns: {
      id: true,
    },
  });
  if (!chatbot) throw new Error("Chatbot not found");

  const id = `${configType}/${company}`;

  if (value === "") {
    await db
      .delete(chatbotSettings)
      .where(
        and(
          eq(chatbotSettings.chatbotId, chatbot.id),
          eq(chatbotSettings.id, id),
        ),
      );
  }

  await db
    .insert(chatbotSettings)
    .values({
      id,
      value,
      chatbotId: chatbot.id,
      category: "secret",
    })
    .onConflictDoUpdate({
      target: [chatbotSettings.id, chatbotSettings.chatbotId],
      set: {
        value: sql.raw(`excluded.${chatbotSettings.value.name}`),
      },
    });
}

export async function deleteSecret(
  chatbotName: string,
  company: string,
  configType: string,
) {
  const user = await currentUser();
  if (!user) redirect("/signin");

  const chatbot = await db.query.chatbots.findFirst({
    where: and(eq(chatbots.name, chatbotName), eq(chatbots.userId, user.id)),
    columns: {
      id: true,
    },
  });
  if (!chatbot) throw new Error("Chatbot not found");

  await db
    .delete(chatbotSettings)
    .where(
      and(
        eq(chatbotSettings.chatbotId, chatbot.id),
        eq(chatbotSettings.id, `${configType}/${company}`),
      ),
    );
}

export async function createCustomLLM(
  values: {
    model: string;
    baseURL: string;
    apiKey?: string;
  },
  chatbotName: string,
) {
  const user = await currentUser();
  if (!user) redirect(env.NEXT_PUBLIC_CLERK_SIGN_IN_URL);

  const chatbot = await db.query.chatbots.findFirst({
    where: and(eq(chatbots.name, chatbotName), eq(chatbots.userId, user.id)),
    columns: {
      id: true,
    },
  });
  if (!chatbot) throw new Error("Chatbot not found");

  await db.insert(chatbotSettings).values({
    id: `llm/${values.model}`,
    value: JSON.stringify({
      baseURL: values.baseURL,
      apiKey: values.apiKey,
    }),
    chatbotId: chatbot.id,
    category: "secret",
  });
}
