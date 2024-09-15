import Config from "@/components/config";
import { db } from "@/db";
import {
  CONFIG_SCHEMA,
  parseSettings,
  SECRETS_SCHEMA,
} from "@/lib/settings";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ConfigPage({
  params,
}: {
  params: { chatbotName: string };
}) {
  const user = await currentUser();
  if (!user) redirect("/signin");

  const chatbot = await db.query.chatbots.findFirst({
    where: (chatbots, { eq }) => eq(chatbots.name, params.chatbotName),
    with: {
      settings: {
        where: (chatbotSettings, { inArray }) =>
          inArray(chatbotSettings.category, ["config", "secret"]),
        columns: {
          id: true,
          value: true,
          valueType: true,
        },
      },
    },
  });
  if (!chatbot) redirect("/chatbots");

  const settings = parseSettings(CONFIG_SCHEMA, chatbot.settings);
  const secrets = parseSettings(SECRETS_SCHEMA, chatbot.settings);

  const lastUpdate = Date.now();

  return (
    <Config
      key={lastUpdate}
      chatbotName={params.chatbotName}
      pageSettings={settings}
      pageSecrets={secrets}
    />
  );
}
