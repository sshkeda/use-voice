"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useVoice } from "use-voice";
import { Button } from "./ui/button";
import VoiceCircles from "./voice-circles";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import VoiceControls from "./voice-controls";
import { cn } from "@/lib/utils";
import Chat from "./chat";

export default function Test({
  chatbotName,
  accessToken,
}: {
  chatbotName: string;
  accessToken: string;
}) {
  const pathname = usePathname();
  const bigCircleRef = useRef<SVGCircleElement>(null);
  const smallCircleRef = useRef<SVGCircleElement>(null);

  const {
    stop,
    start,
    state,
    input,
    muted,
    messages,
    toggleMute,
    handleSubmit,
    handleInputChange,
    isLoading,
    error,
  } = useVoice({
    accessToken,
    onLocalAudio: (localVolume) => {
      if (!bigCircleRef.current) return;
      bigCircleRef.current.style.transform = `scale(${Math.max(1, 1 + localVolume - 0.2)})`;
    },
    onChatbotAudio: (chatbotVolume) => {
      if (!smallCircleRef.current) return;
      smallCircleRef.current.style.transform = `scale(${Math.max(1, 1 + chatbotVolume - 0.2)})`;
    },
  });

  useEffect(() => stop, [pathname, stop]);

  return (
    <div>
      <Card className="relative mt-6">
        <div className="flex flex-wrap justify-center md:flex-nowrap">
          <div className="border-r-0 md:border-r">
            <div className="relative z-10 px-[34px] pt-[34px]">
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "absolute right-2 top-2 z-50",
                  state === "connected" ? "block" : "hidden",
                )}
                onClick={stop}
              >
                disconnect
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "absolute right-2 top-2 z-50",
                  state === "error" ? "block" : "hidden",
                )}
                onClick={start}
              >
                retry
              </Button>
              <VoiceCircles
                largeRef={bigCircleRef}
                smallRef={smallCircleRef}
                state={state}
                smallClassname="fill-red-400"
              />
            </div>
            {/* TODO: Analytics */}
            <div className="pointer-events-none px-8 py-4 opacity-0">
              <div className="space-y-1 rounded-md bg-zinc-900/100 px-4 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">latest RT</span>
                  <span className="font-mono text-lg">---ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">average RT</span>
                  <span className="font-mono text-lg">---ms</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center px-8 pb-4">
              <VoiceControls
                className="w-full py-4"
                state={state}
                start={start}
                muted={muted}
                toggleMute={toggleMute}
              />
            </div>
          </div>
          <Chat
            className=""
            messages={messages}
            voice={{
              chatbotName,
              input,
              handleInputChange,
              state,
              isLoading,
              handleSubmit,
            }}
          />
        </div>
      </Card>
      {error && (
        <Card className="mt-8 p-4">
          <CardHeader>
            <CardTitle>error</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="flex rounded-md bg-zinc-900/50 p-2">
              <span className="font-mono text-muted-foreground">
                {/* 09/04/2024 16:43:01.234 |
                <span className="ml-1 font-sans text-foreground">
                  {" "}
                  user requested room
                </span> */}
                {error.message}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
