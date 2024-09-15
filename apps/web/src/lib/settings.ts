import { z, ZodTypeAny } from "zod";
import { atom } from "jotai";
import { getProvider } from "./providers";

export type Settings = { [key: string]: string | number | undefined };

export type DEPLOY_SETTINGS = z.infer<typeof DEPLOY_SCHEMA>;
export const DEPLOY_SCHEMA = z.object({
  "deploy/access_token": z.string().cuid2().optional(),
  "deploy/public_url": z.string().url().optional(),
});

export type SECRETS = z.infer<typeof SECRETS_SCHEMA>;
export const SECRETS_SCHEMA = z.object({
  "stt/Deepgram": z.string().optional().default(""),
  "stt/Groq": z.string().optional().default(""),
  "llm/OpenAI": z.string().optional().default(""),
  "tts/OpenAI": z.string().optional().default(""),
  "tts/ElevenLabs": z.string().optional().default(""),
  "tts/Cartesia": z.string().optional().default(""),
});

export type STT_SETTINGS = z.infer<typeof STT_SCHEMA>;
export const STT_SCHEMA = z.object({
  "stt/provider": z.string().default(""),
  "stt/silence_threshold": z.coerce
    .number({
      invalid_type_error: "Threshold must be a number.",
    })
    .int("Threshold must be an integer.")
    .min(0, "Threshold must be at least 0.")
    .max(5000, "Threshold must be at most 5000.")
    .default(200),

  "stt/wake_word": z.string().optional().default(""),
});

export type LLM_SETTINGS = z.infer<typeof LLM_SCHEMA>;
export const LLM_SCHEMA = z.object({
  "llm/provider": z.string().default(""),
  "llm/system_message": z.string().optional().default(""),
});

export type TTS_SETTINGS = z.infer<typeof TTS_SCHEMA>;
export const TTS_SCHEMA = z.object({
  "tts/provider": z.string().default(""),
  "tts/voice_id": z.string().default(""),
  "tts/greeting": z.string().optional().default(""),
});

export type CONFIG_SETTINGS = z.infer<typeof CONFIG_SCHEMA>;
export const CONFIG_SCHEMA = STT_SCHEMA.merge(LLM_SCHEMA).merge(TTS_SCHEMA);
export const configAtom = atom<CONFIG_SETTINGS>(CONFIG_SCHEMA.parse({}));

export function parseSettings<T extends ZodTypeAny>(
  schema: T,
  settings: {
    id: string;
    value: string;
    valueType: "int" | "float" | "string";
  }[],
): z.infer<typeof schema> {
  const parsedSettings = settings.reduce(
    (acc, { id, value, valueType }) => {
      let parsedValue: string | number = value;

      if (valueType === "int") {
        parsedValue = parseInt(value);
      } else if (valueType === "float") {
        parsedValue = parseFloat(value);
      }

      acc[id] = parsedValue;
      return acc;
    },
    {} as { [id: string]: string | number | undefined },
  );

  return schema.parse(parsedSettings);
}

export function getSecret(
  secrets: SECRETS,
  company: string | undefined,
  configType: string,
) {
  if (!company) return "";
  return secrets[`${configType}/${company}` as keyof SECRETS];
}

export const secretsAtom = atom<SECRETS>(SECRETS_SCHEMA.parse({}));

export function validateConfig(config: CONFIG_SETTINGS, secrets: SECRETS) {
  const sttProvider = getProvider(config["stt/provider"]);
  if (!sttProvider) return false;
  const llmProvider = getProvider(config["llm/provider"]);
  if (!llmProvider) return false;
  const ttsProvider = getProvider(config["tts/provider"]);
  if (!ttsProvider) return false;

  if (!getSecret(secrets, sttProvider.company, "stt")) return false;
  if (!getSecret(secrets, llmProvider.company, "llm")) return false;
  if (!getSecret(secrets, ttsProvider.company, "tts")) return false;

  if (!config["stt/silence_threshold"]) return false;
  if (!config["tts/voice_id"]) return false;

  return true;
}
