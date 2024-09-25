import Usage from "@/components/usage";
import { db } from "@/db";
import { chatbots, sessions } from "@/db/schema";
import { env } from "@/env.mjs";
import { currentUser } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import { union } from "drizzle-orm/sqlite-core";
import { redirect } from "next/navigation";

export default async function UsagePage({
  params,
}: {
  params: { chatbotName: string };
}) {
  const user = await currentUser();
  if (!user) redirect(env.NEXT_PUBLIC_CLERK_SIGN_IN_URL);

  // TODO: use a union instead
  const [allChatbots, pageSessions] = await Promise.all([
    db.query.chatbots.findMany({
      where: eq(chatbots.userId, user.id),
      columns: {
        id: true,
        name: true,
      },
    }),
    db.query.sessions.findMany({
      where: eq(sessions.userId, user.id),
      orderBy: desc(sessions.createdAt),
      limit: 25,
    }),
  ]);

  return (
    <Usage
      pageSessions={pageSessions}
      chatbots={allChatbots.reduce(
        (acc, { id, name }) => {
          acc[id] = name;
          return acc;
        },
        {} as { [chatbotId: string]: string },
      )}
    />
  );
}
