import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Chatbot({
  params,
}: {
  params: { chatbotName: string };
}) {
  const user = await currentUser();
  if (!user) redirect("/signin");

  const chatbot = await db.query.chatbots.findFirst({
    where: (chatbots, { eq }) => eq(chatbots.name, params.chatbotName),
  });
  if (!chatbot) redirect("/chatbots");

  redirect(`/chatbots/${chatbot.name}/config`);
}
