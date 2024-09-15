"use client";

import { useVoice } from "use-voice";
import { type ElementRef, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Separator } from "./ui/separator";
import VoiceCircles from "./voice-circles";
import VoiceControls from "./voice-controls";

export default function VoiceDemo() {
  const bigCircleRef = useRef<ElementRef<"circle">>(null);
  const smallCircleRef = useRef<ElementRef<"circle">>(null);

  const { state, start, error, muted, toggleMute } = useVoice({
    accessToken: "n3wtrvcvfrna98rhq6hw077b",
    onLocalAudio: (localVolume) => {
      bigCircleRef.current!.style.transform = `scale(${Math.max(1, 1 + localVolume - 0.2)})`;
    },
    onChatbotAudio: (chatbotVolume) => {
      smallCircleRef.current!.style.transform = `scale(${Math.max(1, 1 + chatbotVolume - 0.2)})`;
    },
  });

  useEffect(() => {
    if (state === "requestingMicrophone") {
      toast("Requesting microphone access.");
    } else if (state === "creatingRoom") {
      toast("Connecting to voice demo chatbot.");
    } else if (state === "connected") {
      toast.success("Voice demo chatbot connected.");
    } else if (state == "error") {
      toast.error(error?.message || "Unknown error occurred.");
    }
  }, [error?.message, state]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative z-10 rounded-full border bg-background p-[34px]">
        <VoiceCircles
          largeRef={bigCircleRef}
          smallRef={smallCircleRef}
          state={state}
        />
      </div>
      <div className="absolute top-[330px] flex justify-end md:top-[480px]">
        <Separator className="mr-[116px] h-16" orientation="vertical" />
        <Separator className="h-16" orientation="vertical" />
      </div>
      <div className="h-6 md:h-12" />
      <div className="flex items-center">
        <VoiceControls
          state={state}
          start={start}
          muted={muted}
          toggleMute={toggleMute}
        />
      </div>
    </div>
  );
}
