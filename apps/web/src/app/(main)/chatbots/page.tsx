import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import ChatbotsList from "@/components/chatbots-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Chatbots() {
  const user = await currentUser();
  if (!user) redirect("/signin");

  const account = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, user.id),
    with: {
      chatbots: true,
    },
  });
  if (!account) redirect("/onboarding");

  return (
    <main className="mx-auto mt-6 max-w-screen-lg px-4">
      <Card>
        <CardHeader>
          <CardTitle>chatbots</CardTitle>
        </CardHeader>
        <CardContent>
          <ChatbotsList allChatbots={account.chatbots} />
        </CardContent>
      </Card>
    </main>
  );
}
