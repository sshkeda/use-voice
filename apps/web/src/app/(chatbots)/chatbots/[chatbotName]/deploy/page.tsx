import Deploy from "@/components/deploy";
import { db } from "@/db";
import { DEPLOY_SCHEMA, parseSettings } from "@/lib/settings";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DeployPage({
  params,
}: {
  params: { chatbotName: string };
}) {
  const user = await currentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const chatbot = await db.query.chatbots.findFirst({
    where: (chatbots, { eq }) => eq(chatbots.name, params.chatbotName),
    with: {
      settings: {
        where: (chatbotSettings, { inArray }) =>
          inArray(chatbotSettings.category, ["deploy"]),
        columns: {
          id: true,
          value: true,
          valueType: true,
        },
      },
    },
  });
  if (!chatbot) redirect("/chatbots");

  const pageSettings = parseSettings(DEPLOY_SCHEMA, chatbot.settings);

  return (
    <Deploy chatbotName={params.chatbotName} pageSettings={pageSettings} />
  );
}
