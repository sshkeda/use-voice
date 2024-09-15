"use client";

import { useVoice } from "use-voice";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useEnterSubmit } from "@/lib/hooks/use-enter-submit";
import { cn } from "@/lib/utils";

type ChatVoiceProps = {
  chatbotName: string;
  input: ReturnType<typeof useVoice>["input"];
  handleInputChange: ReturnType<typeof useVoice>["handleInputChange"];
  state: ReturnType<typeof useVoice>["state"];
  isLoading: ReturnType<typeof useVoice>["isLoading"];
  handleSubmit: ReturnType<typeof useVoice>["handleSubmit"];
};

export type Message = {
  role: "user" | "assistant";
  content: string;
};
export default function Chat({
  messages,
  voice,
  className,
}: {
  messages: Message[];
  voice?: ChatVoiceProps;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative mt-4 w-full border-t md:mt-0 md:border-t-0",
        className,
      )}
    >
      <div
        className={cn(
          "h-[500px] overflow-y-auto md:absolute md:inset-0 md:h-auto",
          voice && "pb-[72px]",
        )}
      >
        {messages.map(({ role, content }, index) =>
          role === "user" ? (
            <div key={index} className="m-4 flex justify-end">
              <div className="inline-flex rounded-3xl border px-6 py-2 text-foreground">
                <p className="whitespace-pre-wrap">{content}</p>
              </div>
            </div>
          ) : (
            <div key={index} className="m-4 flex">
              <div className="inline-flex rounded-3xl text-foreground">
                <p className="whitespace-pre-wrap">
                  <span className="mr-2 mt-[5px] inline-flex aspect-square h-3 w-3 rounded-full bg-red-400" />
                  {content}
                </p>
              </div>
            </div>
          ),
        )}
      </div>

      {voice && <ChatInput voice={voice} />}
    </div>
  );
}

function ChatInput({ voice }: { voice: ChatVoiceProps }) {
  const { onKeyDown } = useEnterSubmit(voice.handleSubmit);

  return (
    <div className="absolute bottom-0 flex w-full space-x-2 rounded-md rounded-br-xl p-4 backdrop-blur-md">
      <Input
        placeholder={`message ${voice.chatbotName}`}
        value={voice.input}
        onChange={voice.handleInputChange}
        disabled={voice.state !== "connected"}
        onKeyDown={onKeyDown}
      />
      <Button
        type="submit"
        variant="secondary"
        disabled={
          voice.isLoading ||
          voice.input.length === 0 ||
          voice.state !== "connected"
        }
        onClick={voice.handleSubmit}
      >
        send
      </Button>
    </div>
  );
}
