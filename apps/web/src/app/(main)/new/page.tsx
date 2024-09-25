import { db } from "@/db";
import { users } from "@/db/schema";
import { env } from "@/env.mjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function NewPage() {
  const user = await currentUser();
  if (!user) redirect(env.NEXT_PUBLIC_CLERK_SIGN_IN_URL);

  await db
    .insert(users)
    .values({
      id: user.id,
    })
    .onConflictDoNothing();

  redirect("/chatbots");
}
