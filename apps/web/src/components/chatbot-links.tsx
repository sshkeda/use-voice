"use client";

import { cn } from "@/lib/utils";
import { Play, Rocket, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

const links = [
  { name: "config", icon: <SlidersHorizontal className="h-4 w-4" /> },
  { name: "test", icon: <Play className="h-4/ w-4" /> },
  { name: "deploy", icon: <Rocket className="h-4 w-4" /> },
];

export default function ChatbotLinks({ chatbotName }: { chatbotName: string }) {
  const pathname = usePathname();

  return (
    <div className="flex justify-between">
      <div className="inline-flex">
        {links.map(({ name, icon }) => {
          const href = `/chatbots/${chatbotName}/${name}`;
          return (
            <Button
              variant="outline"
              className="rounded-b-none border-b-0 border-r md:rounded-t-2xl"
              size="sm"
              key={name}
              asChild
            >
              <Link
                className={cn(
                  "justify-between px-4 text-muted-foreground hover:text-muted-foreground md:w-[130px]",
                  pathname.startsWith(href) &&
                    "bg-zinc-900 text-foreground hover:bg-zinc-900 hover:text-foreground",
                )}
                href={href}
              >
                <span className="hidden md:inline-block">{name}</span>
                {icon && icon}
              </Link>
            </Button>
          );
        })}
      </div>
      <div className="inline-flex -translate-y-[6px]">
        <Button
          size="sm"
          variant="link"
          className={cn(
            "text-muted-foreground",
            pathname.startsWith(`/chatbots/${chatbotName}/usage`) &&
              "text-foreground underline",
          )}
          asChild
        >
          <Link href={`/chatbots/${chatbotName}/usage`}>usage</Link>
        </Button>
        <Button
          size="sm"
          variant="link"
          className={cn(
            "text-blue-400 hover:text-blue-400",
            pathname.startsWith(`/chatbots/${chatbotName}/sky`) && "underline",
          )}
          asChild
        >
          <Link href={`/chatbots/${chatbotName}/sky`}>
            <div className="mr-2 h-2 w-2 rounded-full bg-blue-400" />
            upgrade
          </Link>
        </Button>
      </div>
    </div>
  );
}
