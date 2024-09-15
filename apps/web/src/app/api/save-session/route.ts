import { db } from "@/db";
import { chatbotSettings, sessions } from "@/db/schema";
import { env } from "@/env.mjs";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";


export const dynamic = "force-dynamic";
export const maxDuration = 30;

const schema = z.object({
    messages: z.string().min(1),
    accessToken: z.string().min(1),
    duration: z.number()

})


export async function POST(request: Request) {
    const authorization = headers().get("Authorization")
    if (!authorization) return new Response("Unauthorized", { status: 401 })
    if (authorization !== env.USE_VOICE_SECRET) return new Response("Unauthorized", { status: 401 })


    const json = await request.json()
    const { messages, accessToken, duration } = schema.parse(json)

    const result = await db.query.chatbotSettings.findFirst({
        where: and(
            eq(chatbotSettings.id, "deploy/access_token"),
            eq(chatbotSettings.value, accessToken)),
        columns: {},
        with: {
            chatbot: {
                columns: {
                    id: true,
                    userId: true
                }
            },

        }
    })
    if (!result?.chatbot) return new Response("Unauthorized", { status: 401 })

    await db.insert(sessions).values({
        accessToken,
        chatbotId: result?.chatbot.id,
        userId: result?.chatbot.userId,
        duration,
        messages
    })

    return new Response("", { status: 200 })

}