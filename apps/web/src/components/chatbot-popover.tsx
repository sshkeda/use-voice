"use client";

import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DeleteChatbot from "./delete-chatbot";

export default function ChatbotsHeader({
  chatbotName,
}: {
  chatbotName: string;
}) {
  const pathname = usePathname();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="none"
          className="z-20 space-x-2 rounded-2xl px-4 py-1 transition-colors data-[state=open]:bg-zinc-900"
        >
          <div className="h-2 w-2 rounded-full bg-red-400" />
          <h1 className="ml-2 text-base">{chatbotName}</h1>
        </Button>
      </PopoverTrigger>
      <PopoverContent sideOffset={8}>
        <DeleteChatbot chatbotName={chatbotName} />
      </PopoverContent>
    </Popover>
  );
}
