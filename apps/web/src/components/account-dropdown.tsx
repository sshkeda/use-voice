"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, MoreHorizontal, Settings } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { useState } from "react";

export default function AccountDropdown() {
  const { isSignedIn } = useUser();
  const pathname = usePathname();
  const { signOut, openUserProfile } = useClerk();
  const [open, setOpen] = useState(false);

  const isChatbotPage = pathname.startsWith("/chatbots");

  if (isSignedIn || isChatbotPage) {
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={3}>
          <DropdownMenuItem asChild>
            <Link href="/chatbots">chatbots</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/">docs</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/">home</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <button
            onClick={() => {
              setOpen(false);
              openUserProfile();
            }}
            className="relative flex w-full cursor-default select-none items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            settings
            <Settings className="h-4 w-4 stroke-muted-foreground" />
          </button>
          <DropdownMenuItem
            onClick={() => signOut()}
            className="flex justify-between"
          >
            sign out
            <LogOut className="h-4 w-4 stroke-muted-foreground" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const isAuthPage = pathname === "/signin" || pathname === "/signup";

  if (isAuthPage) {
    return (
      <Button variant="outline" size="sm" asChild>
        <Link href="/">home</Link>
      </Button>
    );
  }

  return (
    <div>
      <Button
        variant="link"
        size="sm"
        asChild
        className="text-muted-foreground"
      >
        <Link href="/signin">sign in</Link>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <Link href="/signup">sign up</Link>
      </Button>
    </div>
  );
}
