"use client";

import { chatbots } from "@/db/schema";

import Link from "next/link";
import NewChatbot from "./new-chatbot";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export default function ChatbotsList({
  chatbotName,
  allChatbots,
}: {
  chatbotName?: string;
  allChatbots: (typeof chatbots.$inferSelect)[];
}) {
  return (
    <div className="inline-flex">
      <div
        className={cn(
          "grid grid-cols-1 gap-4",
          allChatbots.length === 0
            ? "md:grid-cols-1"
            : allChatbots.length === 1
              ? "md:grid-cols-2"
              : "md:grid-cols-3",
        )}
      >
        <NewChatbot allChatbots={allChatbots.map(({ name }) => name)} />
        {allChatbots.map((chatbot) => (
          <Chatbot
            key={chatbot.id}
            chatbot={chatbot}
            selectedChatbot={chatbotName}
          />
        ))}
      </div>
    </div>
  );
}

function Chatbot({
  chatbot,
  selectedChatbot,
}: {
  chatbot: typeof chatbots.$inferSelect;
  selectedChatbot?: string;
}) {
  if (selectedChatbot === chatbot.name) {
    return (
      <div className="bg flex h-20 w-60 items-center justify-center rounded-md border bg-zinc-900">
        <div className="mr-2 inline-flex h-2 w-2 rounded-full bg-red-400" />
        <span className="text-lg font-medium">{chatbot.name}</span>
      </div>
    );
  }

  return (
    <Button variant="outline" className="h-20 w-60" asChild>
      <Link href={`/chatbots/${chatbot.name}`}>
        <div className="mr-2 inline-flex h-2 w-2 rounded-full bg-red-400" />
        <span className="text-lg font-medium">{chatbot.name}</span>
      </Link>
    </Button>
  );
}
