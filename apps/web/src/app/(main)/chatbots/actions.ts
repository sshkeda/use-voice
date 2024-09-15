"use server";

import { db } from "@/db";
import { chatbots } from "@/db/schema";
import { env } from "@/env.mjs";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function createChatbot(chatbotName: string) {
  z.string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9._-]+$/)
    .parse(chatbotName);

  const user = await currentUser();

  if (!user) redirect(env.NEXT_PUBLIC_CLERK_SIGN_IN_URL);

  await db.insert(chatbots).values({
    name: chatbotName,
    userId: user.id,
  });

  redirect(`/chatbots/${chatbotName}`);
}

export async function deleteChatbot(chatbotName: string) {
  const user = await currentUser();
  if (!user) redirect(env.NEXT_PUBLIC_CLERK_SIGN_IN_URL);

  await db
    .delete(chatbots)
    .where(and(eq(chatbots.userId, user.id), eq(chatbots.name, chatbotName)));

  revalidatePath("/chatbots");
  redirect("/chatbots");
}
