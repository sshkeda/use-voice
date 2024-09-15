import Test from "@/components/test";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { chatbots, chatbotSettings } from "@/db/schema";
import { env } from "@/env.mjs";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function TestPage({
  params,
}: {
  params: { chatbotName: string };
}) {
  const user = await currentUser();
  if (!user) redirect(env.NEXT_PUBLIC_CLERK_SIGN_IN_URL);

  const chatbot = await db.query.chatbots.findFirst({
    where: and(
      eq(chatbots.userId, user.id),
      eq(chatbots.name, params.chatbotName),
    ),
    columns: {},
    with: {
      settings: {
        where: eq(chatbotSettings.id, "deploy/access_token"),
        columns: {
          value: true,
        },
      },
    },
  });
  if (!chatbot) redirect("/chatbots");

  const accessToken = chatbot.settings[0]?.value;
  if (!accessToken)
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TriangleAlert className="mr-2 h-6 w-6 stroke-muted-foreground" />
            {`you don't have an access token yet. create one`}
            <Link
              href={`/chatbots/${params.chatbotName}/deploy`}
              className="ml-2 underline"
            >
              here →
            </Link>
          </CardTitle>
        </CardHeader>
      </Card>
    );

  return <Test accessToken={accessToken} chatbotName={params.chatbotName} />;
}
