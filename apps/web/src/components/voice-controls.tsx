"use client";

import type { useVoice } from "use-voice";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Mic, MicOff, Play, TriangleAlert } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export default function VoiceControls({
  state,
  start,
  muted,
  toggleMute,
  className,
}: {
  state: ReturnType<typeof useVoice>["state"];
  start: ReturnType<typeof useVoice>["start"];
  muted: ReturnType<typeof useVoice>["muted"];
  toggleMute: ReturnType<typeof useVoice>["toggleMute"];
  className?: string;
}) {
  if (state === "idle") {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="none"
            className={cn(
              "z-20 w-[306px] rounded-lg border-zinc-600 p-4 md:px-12 md:py-4",
              className,
            )}
            onClick={start}
          >
            <Play className="h-7 w-7" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Start voice chatbot</TooltipContent>
      </Tooltip>
    );
  }

  if (
    [
      "requestingMicrophone",
      "creatingRoom",
      "joiningRoom",
      "disconnecting",
    ].includes(state)
  ) {
    return (
      <div
        className={cn(
          "z-20 flex w-[306px] items-center justify-center rounded-lg border border-zinc-600 bg-background p-4 md:px-12 md:py-4",
          className,
        )}
      >
        <MicOff className="h-7 w-7 stroke-muted-foreground" />
      </div>
    );
  }

  if (state === "connected") {
    return (
      <Button
        variant="outline"
        size="none"
        className={cn(
          "z-20 w-[306px] rounded-lg border-zinc-600 p-4 md:px-12 md:py-4",
          className,
        )}
        onClick={toggleMute}
      >
        {muted ? (
          <MicOff className="h-7 w-7 stroke-muted-foreground" />
        ) : (
          <Mic className="h-7 w-7" />
        )}
      </Button>
    );
  }

  return (
    <div
      className={cn(
        "z-20 flex w-[306px] items-center justify-center rounded-lg border border-zinc-600 bg-background p-4 md:px-12 md:py-4",
        className,
      )}
    >
      <TriangleAlert className="h-7 w-7 stroke-muted-foreground" />
    </div>
  );
}
