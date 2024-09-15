import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { db } from "@/db";
import { chatbots } from "@/db/schema";
import { env } from "@/env.mjs";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import ChatbotsList from "./chatbots-list";

export default async function ChatbotsPopover({
  chatbotName,
}: {
  chatbotName: string;
}) {
  const user = await currentUser();
  if (!user) redirect(env.NEXT_PUBLIC_CLERK_SIGN_IN_URL);

  const allChatbots = await db.query.chatbots.findMany({
    where: eq(chatbots.userId, user.id),
    orderBy: desc(chatbots.updatedAt),
  });

  return (
    <Popover>
      <PopoverTrigger asChild className="group">
        <button className="flex h-[34px] w-[34px] items-center justify-center rounded-full border bg-background">
          <div className="h-[16px] w-[16px] rounded-full bg-muted-foreground transition-colors group-hover:bg-white group-data-[state=open]:bg-white" />
        </button>
      </PopoverTrigger>
      <PopoverContent sideOffset={8}>
        <ChatbotsList chatbotName={chatbotName} allChatbots={allChatbots} />
      </PopoverContent>
    </Popover>
  );
}
