import { db } from "@/db";
import { users } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const user = await currentUser();
  if (!user) redirect("/signin");

  await db
    .insert(users)
    .values({
      id: user.id,
    })
    .onConflictDoNothing();

  redirect("/chatbots");
}
