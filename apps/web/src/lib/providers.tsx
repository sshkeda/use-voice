import ElevenLabs from "@/components/icons/elevenlabs";
import {
  SiAnthropic,
  SiC,
  SiDeepgram,
  // SiErpnext,
  // SiGooglegemini,
  // SiMeta,
  SiOpenai,
} from "@icons-pack/react-simple-icons";

type Metric = {
  label: string;
  value: string;
};

export type Provider = {
  model: string;
  company: string;
  icon: JSX.Element;
  metrics?:
    | {
        WER: Metric;
        SPS: Metric;
        CPM: Metric;
      }
    | {
        LMSYS: Metric;
        TPS: Metric;
        CP1mI: Metric;
        CP1mO: Metric;
      }
    | {
        TTA: Metric;
        CP1k: Metric;
      };
};

export type Providers = {
  [key: string]: Provider;
};

export const STT_PROVIDERS: Providers = {
  "Deepgram/nova-2-conversationalai": {
    model: "Nova-2",
    company: "Deepgram",
    icon: <SiDeepgram />,
    metrics: {
      WER: {
        label: "Word Error Rate",
        value: "10.7%",
      },
      SPS: {
        label: "The number of input audio seconds transcribed per second",
        value: "120.81s",
      },
      CPM: {
        label: "Cost Per Minute (pay as you go)",
        value: "$0.0059",
      },
    },
  },
  // "Groq/whisper-large-v3": {
  //   model: "Whisper Large V3",
  //   company: "Groq",
  //   icon: <SiOpenai />,
  //   metrics: {
  //     WER: {
  //       label: "Word Error Rate",
  //       value: "10.3%",
  //     },
  //     SPS: {
  //       label: "Input seconds transcribed per second",
  //       value: "164.2s",
  //     },
  //     CPM: {
  //       label: "Cost Per Minute",
  //       value: "$0.0005",
  //     },
  //   },
  // },
};

export const LLM_PROVIDERS: Providers = {
  "OpenAI/gpt-4o": {
    model: "GPT-4o",
    company: "OpenAI",
    icon: <SiOpenai />,
  },
  "OpenAI/gpt-4o-mini": {
    model: "GPT-4o mini",
    company: "OpenAI",
    icon: <SiOpenai />,
  },
  "Anthropic/claude-3-5-sonnet-20240620": {
    model: "Claude 3.5 Sonnet",
    company: "Anthropic",
    icon: <SiAnthropic />,
  },
  "Anthropic/claude-3-haiku-20240307": {
    model: "Claude 3 Haiku",
    company: "Anthropic",
    icon: <SiAnthropic />,
  },
  // "Google/gemini-1.5-pro": {
  //   model: "Gemini 1.5 Pro",
  //   company: "Google",
  //   icon: <SiGooglegemini />,
  // },
  // "Google/gemini-1.5-flash": {
  //   model: "Gemini 1.5 Flash",
  //   company: "Google",
  //   icon: <SiGooglegemini />,
  // },
  // "Groq/llama.3.1-70b": {
  //   model: "Llama 3.1 70b",
  //   company: "Groq",
  //   icon: <SiMeta />,
  // },
  // "Groq/llama.3.1-8b": {
  //   model: "Llama 3.1 8b",
  //   company: "Groq",
  //   icon: <SiMeta />,
  // },
};

export const TTS_PROVIDERS: Providers = {
  // "Deepgram/aura": {
  //   model: "Aura",
  //   company: "Deepgram",
  //   icon: <SiDeepgram />,
  //   metrics: {
  //     TTA: {
  //       label: "Time to Audio",
  //       value: "250ms",
  //     },
  //     CP1k: {
  //       label: "Cost Per 1k characters (pay as you go)",
  //       value: "$0.0150",
  //     },
  //   },
  // },
  "ElevenLabs/eleven_turbo_v2_5": {
    model: "Turbo v2.5",
    company: "ElevenLabs",
    icon: <ElevenLabs />,
  },
  "ElevenLabs/eleven_multilingual_v2": {
    model: "Multilingual v2",
    company: "ElevenLabs",
    icon: <ElevenLabs />,
  },
  "OpenAI/tts-1": {
    model: "tts-1",
    company: "OpenAI",
    icon: <SiOpenai />,
  },
  "OpenAI/tts-1-hd": {
    model: "tts-1-hd",
    company: "OpenAI",
    icon: <SiOpenai />,
  },
  "Cartesia/sonic-english": {
    model: "Sonic English",
    company: "Cartesia",
    icon: <SiC />,
  },
};

export const ALL_PROVIDERS = {
  ...STT_PROVIDERS,
  ...LLM_PROVIDERS,
  ...TTS_PROVIDERS,
};

export function getProviders(modelType: "stt" | "llm" | "tts") {
  return (
    {
      stt: STT_PROVIDERS,
      llm: LLM_PROVIDERS,
      tts: TTS_PROVIDERS,
    } as const
  )[modelType];
}

export function getProvider(providerKey: string) {
  if (providerKey in ALL_PROVIDERS) {
    return ALL_PROVIDERS[providerKey as keyof typeof ALL_PROVIDERS];
  } else {
    return null;
  }
}
