"use client";

import {
  type Provider,
  type Providers,
  LLM_PROVIDERS,
  STT_PROVIDERS,
  TTS_PROVIDERS,
} from "@/lib/providers";
import { Separator } from "./ui/separator";
import { useEffect, useState } from "react";

export default function HomeStack() {
  return (
    <div className="space-y-4 ml-8">
      <RandomStack />
      <RandomStack />
      <RandomStack />
      <RandomStack />
      <RandomStack />
    </div>
  );
}

function generateStack() {
  function getRandom(providers: Providers) {
    return Object.entries(providers)[
      Math.floor(Math.random() * Object.entries(providers).length)
    ];
  }

  const [, stt] = getRandom(STT_PROVIDERS);
  const [, llm] = getRandom(LLM_PROVIDERS);
  const [, tts] = getRandom(TTS_PROVIDERS);

  return { stt, llm, tts };
}

function RandomStack() {
  const [stack, setStack] = useState<null | ReturnType<typeof generateStack>>(
    null,
  );

  useEffect(() => {
    setStack(generateStack());
  }, []);

  return (
    <div>
      {stack && (
        <div className="flex items-center">
          <ProviderView provider={stack.stt} />
          <Separator className="w-4" />
          <ProviderView provider={stack.llm} />
          <Separator className="w-4" />
          <ProviderView provider={stack.tts} />
        </div>
      )}
    </div>
  );
}

function ProviderView({ provider }: { provider: Provider }) {
  return (
    <div className="inline-flex items-center rounded-xl border p-4">
      <div className="h-6 w-6">{provider.icon}</div>
      <div className="ml-3 text-start">
        <p className="text-lg font-medium leading-5">{provider.model}</p>
        <p className="text-sm leading-5 text-muted-foreground">
          {provider.company}
        </p>
      </div>
    </div>
  );
}
