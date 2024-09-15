"use server";

import { db } from "@/db";
import { chatbots, sessions } from "@/db/schema";
import { env } from "@/env.mjs";
import { currentUser } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function loadMoreSessions(currentSessionsAmount: number) {
  const user = await currentUser();
  if (!user) redirect(env.NEXT_PUBLIC_CLERK_SIGN_IN_URL);

  return await db.query.sessions.findMany({
    where: eq(sessions.userId, user.id),
    orderBy: desc(sessions.createdAt),
    limit: 25,
    offset: currentSessionsAmount,
  });
}
