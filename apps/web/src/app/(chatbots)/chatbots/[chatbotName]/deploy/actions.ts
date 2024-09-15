"use server";

import { db } from "@/db";
import { chatbotSettings } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { createId } from "@paralleldrive/cuid2";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function generateAccessToken(chatbotName: string) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const chatbot = await db.query.chatbots.findFirst({
    where: (chatbots, { eq }) => eq(chatbots.name, chatbotName),
    columns: {
      id: true,
    },
  });
  if (!chatbot) throw new Error("Chatbot not found");

  const newId = createId();
  const insert = await db
    .insert(chatbotSettings)
    .values({
      chatbotId: chatbot.id,
      category: "deploy",
      id: "deploy/access_token",
      value: newId,
    })
    .onConflictDoUpdate({
      target: [chatbotSettings.id, chatbotSettings.chatbotId],
      set: {
        value: newId,
      },
    })
    .returning();

  revalidatePath(`/chatbots/${chatbotName}/deploy`);
  revalidatePath(`/chatbots/${chatbotName}/test`);

  return insert[0].value;
}

export async function deleteAccessToken(chatbotName: string) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const chatbot = await db.query.chatbots.findFirst({
    where: (chatbots, { eq }) => eq(chatbots.name, chatbotName),
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
        eq(chatbotSettings.id, "deploy/access_token"),
      ),
    );

  revalidatePath(`/chatbots/${chatbotName}/deploy`);
  revalidatePath(`/chatbots/${chatbotName}/test`);
}
