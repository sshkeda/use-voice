import { env } from "@/env.mjs";
import { AccessToken } from "livekit-server-sdk";
import { createId } from "@paralleldrive/cuid2";
import { db } from "@/db";
import { chatbotSettings } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import {
  CONFIG_SCHEMA,
  parseSettings,
  SECRETS_SCHEMA,
  softParse,
  validateConfig,
} from "@/lib/settings";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const schema = z.object({
  accessToken: z.string().nonempty(),
});

async function getAccessToken(request: Request) {
  let accessToken = request.headers.get("Authorization")?.split(" ")[1];

  if (!accessToken) {
    const json = await request.json();
    const body = schema.safeParse(json);

    accessToken = body.data?.accessToken;
  }

  return accessToken;
}

export async function POST(request: Request) {
  const accessToken = await getAccessToken(request);
  if (!accessToken) return new Response("Unauthorized", { status: 403 });

  const accessTokenSetting = await db.query.chatbotSettings.findFirst({
    where: and(
      eq(chatbotSettings.id, "deploy/access_token"),
      eq(chatbotSettings.value, accessToken),
    ),
    columns: {},

    with: {
      chatbot: {
        columns: {},
        with: {
          settings: {
            where: inArray(chatbotSettings.category, ["config", "secret"]),
          },
        },
      },
    },
  });
  if (!accessTokenSetting) return new Response("Unauthorized", { status: 401 });

  const config = parseSettings(
    CONFIG_SCHEMA,
    accessTokenSetting.chatbot.settings,
  );

  const secrets = softParse(accessTokenSetting.chatbot.settings);


  // if (!validateConfig(config)) return new Response("Invalid config", { status: 400 });

  const at = new AccessToken(env.LIVEKIT_API_KEY, env.LIVEKIT_API_SECRET, {
    identity: "init",
    metadata: JSON.stringify({
      accessToken,
      config,
      secrets,
    }),
  });
  at.addGrant({
    room: createId(),
    roomJoin: true,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
  });

  return Response.json({ token: await at.toJwt(), url: env.LIVEKIT_URL });
}
