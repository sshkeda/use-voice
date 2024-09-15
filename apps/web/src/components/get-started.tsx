"use client";

import { useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Link from "next/link";

export default function GetStarted() {
  const { isSignedIn } = useUser();

  return (
    <Button
      variant="outline"
      size="none"
      className="flex-grow rounded-2xl px-6 py-4 text-base md:w-auto md:flex-grow-0"
      asChild
    >
      <Link href={isSignedIn ? "/chatbots" : "/signup"}>
        <div className="mr-2 h-3 w-3 rounded-full bg-muted-foreground" />
        get started
      </Link>
    </Button>
  );
}
