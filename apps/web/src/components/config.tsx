"use client";

import { ExternalLink } from "lucide-react";
import {
  getProvider,
  LLM_PROVIDERS,
  Provider,
  STT_PROVIDERS,
  TTS_PROVIDERS,
} from "@/lib/providers";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import {
  CONFIG_SETTINGS,
  configAtom,
  getSecret,
  LLM_SCHEMA,
  LLM_SETTINGS,
  SECRETS,
  secretsAtom,
  STT_SCHEMA,
  STT_SETTINGS,
  TTS_SCHEMA,
  TTS_SETTINGS,
} from "@/lib/settings";
import Link from "next/link";
import ProviderSelect from "./provider-select";
import { cn } from "@/lib/utils";
import SecretPopup from "./secret-popover";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { saveChatbotSettings } from "@/app/(chatbots)/chatbots/[chatbotName]/config/actions";
import { toast } from "sonner";
import { useHydrateAtoms } from "jotai/utils";
import { useAtomValue, useSetAtom } from "jotai";
import { Textarea } from "./ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Loader from "./ui/loader";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function Config({
  pageSettings,
  pageSecrets,
  chatbotName,
}: {
  pageSettings: CONFIG_SETTINGS;
  pageSecrets: SECRETS;
  chatbotName: string;
}) {
  useHydrateAtoms([[secretsAtom, pageSecrets]]);
  useHydrateAtoms([[configAtom, pageSettings]]);
  const secrets = useAtomValue(secretsAtom);
  const settings = useAtomValue(configAtom);

  return (
    <div className="mt-6 space-y-8">
      <STT settings={settings} chatbotName={chatbotName} secrets={secrets} />
      <LLM settings={settings} chatbotName={chatbotName} secrets={secrets} />
      <TTS settings={settings} chatbotName={chatbotName} secrets={secrets} />
    </div>
  );
}

function STT({
  settings,
  secrets,
  chatbotName,
}: {
  settings: STT_SETTINGS;
  secrets: SECRETS;
  chatbotName: string;
}) {
  const setConfig = useSetAtom(configAtom);

  const form = useForm<z.infer<typeof STT_SCHEMA>>({
    resolver: zodResolver(STT_SCHEMA),
    defaultValues: settings,
  });

  async function onSubmit(values: z.infer<typeof STT_SCHEMA>) {
    const changes = Object.entries(form.formState.dirtyFields).reduce(
      (changes, [key, isDirty]) => {
        if (isDirty) changes[key] = values[key as keyof typeof values];
        return changes;
      },
      {} as any, // TODO
    ) as Partial<z.infer<typeof STT_SCHEMA>>;

    await saveChatbotSettings(changes, chatbotName, "config");

    toast.success("Updated Speech-To-Text succesfully.");

    setConfig((prev) => {
      const newConfig = { ...prev, ...changes };
      form.reset(newConfig);
      return newConfig;
    });
  }

  const providerId = form.watch("stt/provider");
  const provider = getProvider(providerId);
  const secretValue = getSecret(secrets, provider?.company, "stt");

  const isDirty = Object.keys(form.formState.dirtyFields).length > 0;

  return (
    <Form {...form}>
      <Card>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Speech-To-Text</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="inline-flex flex-wrap rounded-md border md:flex-nowrap">
              <div
                className={cn(
                  "p-2",
                  provider?.metrics &&
                    "w-full border-b md:border-b-0 md:border-r",
                )}
              >
                <FormField
                  control={form.control}
                  name="stt/provider"
                  render={({ field }) => (
                    <FormItem key={field.value}>
                      <ProviderSelect
                        value={field.value}
                        onChange={field.onChange}
                        providers={STT_PROVIDERS}
                      />
                    </FormItem>
                  )}
                />

                {provider && (
                  <div className="mt-2 p-2">
                    <SecretPopup
                      provider={provider}
                      secretValue={secretValue}
                      modelType="stt"
                      chatbotName={chatbotName}
                    />
                  </div>
                )}
              </div>
              {provider?.metrics && <Metrics metrics={provider.metrics} />}
            </div>

            <div className="mt-4 flex flex-wrap gap-4 md:gap-x-8">
              <FormField
                control={form.control}
                name="stt/silence_threshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">
                      start generation threshold (ms)
                    </FormLabel>
                    <FormControl>
                      <Input className="mt-2 w-40" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stt/wake_word"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">
                      wake word (optional)
                    </FormLabel>
                    <FormControl>
                      <Input className="mt-2 w-40" {...field} />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              learn more about{" "}
              <Link
                href="https://github.com/sshkeda/use-voice"
                className="inline-flex items-center text-blue-500 hover:underline"
                target="_blank"
              >
                speech-to-text
                <ExternalLink className="ml-1 h-[13px] w-[13px]" />
              </Link>
            </p>
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              disabled={!isDirty || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && <Loader />}
              save
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Form>
  );
}

function LLM({
  settings,
  secrets,
  chatbotName,
}: {
  settings: LLM_SETTINGS;
  secrets: SECRETS;
  chatbotName: string;
}) {
  const setConfig = useSetAtom(configAtom);

  const form = useForm<z.infer<typeof LLM_SCHEMA>>({
    resolver: zodResolver(LLM_SCHEMA),
    defaultValues: {
      "llm/provider": settings["llm/provider"],
      "llm/system_message": settings["llm/system_message"],
    },
  });

  async function onSubmit(values: z.infer<typeof LLM_SCHEMA>) {
    const changes = Object.entries(form.formState.dirtyFields).reduce(
      (changes, [key, isDirty]) => {
        if (isDirty) changes[key] = values[key as keyof typeof values];
        return changes;
      },
      {} as any, // TODO
    ) as Partial<z.infer<typeof LLM_SCHEMA>>;

    await saveChatbotSettings(changes, chatbotName, "config");

    toast.success("Updated Large-Language-Model succesfully.");

    setConfig((prev) => {
      const newConfig = { ...prev, ...changes };
      form.reset(newConfig);
      return newConfig;
    });
  }

  const providerId = form.watch("llm/provider");
  const provider = getProvider(providerId);
  const secretValue = getSecret(secrets, provider?.company, "llm");

  const isDirty = Object.keys(form.formState.dirtyFields).length > 0;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col rounded-xl border md:flex-nowrap"
      >
        <h2 className="px-8 pb-4 pt-6 text-xl font-medium">
          Large-Language-Model
        </h2>
        <div className="border-b px-8 pb-8">
          <div className="inline-flex rounded-md border">
            <div
              className={cn(
                "p-2",
                provider?.metrics &&
                  "w-full border-b md:border-b-0 md:border-r",
              )}
            >
              <FormField
                control={form.control}
                name="llm/provider"
                render={({ field }) => (
                  <FormItem key={field.value}>
                    <ProviderSelect
                      value={field.value}
                      onChange={field.onChange}
                      providers={LLM_PROVIDERS}
                      custom={true}
                      rootForm={form}
                    />
                  </FormItem>
                )}
              />

              {provider && (
                <div className="mt-2 p-2">
                  <SecretPopup
                    provider={provider}
                    secretValue={secretValue}
                    modelType="llm"
                    chatbotName={chatbotName}
                  />
                </div>
              )}
            </div>
            {provider?.metrics && <Metrics metrics={provider.metrics} />}
          </div>

          <div className="mt-4">
            <FormField
              control={form.control}
              name="llm/system_message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">
                    system message (optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="You are a nice chatbot."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex items-center justify-between px-8 py-4">
          <p className="text-sm text-muted-foreground">
            learn more about{" "}
            <Link
              href="https://github.com/sshkeda/use-voice"
              className="inline-flex items-center text-blue-500 hover:underline"
              target="_blank"
            >
              large-language-model
              <ExternalLink className="ml-1 h-[13px] w-[13px]" />
            </Link>
          </p>
          <Button
            type="submit"
            variant="secondary"
            size="sm"
            disabled={!isDirty || form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && <Loader />}
            save
          </Button>
        </div>
      </form>
    </Form>
  );
}

function TTS({
  settings,
  secrets,
  chatbotName,
}: {
  settings: TTS_SETTINGS;
  secrets: SECRETS;
  chatbotName: string;
}) {
  const setConfig = useSetAtom(configAtom);

  const form = useForm<z.infer<typeof TTS_SCHEMA>>({
    resolver: zodResolver(TTS_SCHEMA),
    defaultValues: {
      "tts/provider": settings["tts/provider"],
      "tts/voice_id": settings["tts/voice_id"],
      "tts/greeting": settings["tts/greeting"],
    },
  });

  async function onSubmit(values: z.infer<typeof TTS_SCHEMA>) {
    const changes = Object.entries(form.formState.dirtyFields).reduce(
      (changes, [key, isDirty]) => {
        if (isDirty) changes[key] = values[key as keyof typeof values];
        return changes;
      },
      {} as any, // TODO
    ) as Partial<z.infer<typeof TTS_SCHEMA>>;

    await saveChatbotSettings(changes, chatbotName, "config");

    toast.success("Updated Text-To-Speech succesfully.");

    setConfig((prev) => {
      const newConfig = { ...prev, ...changes };
      form.reset(newConfig);
      return newConfig;
    });
  }

  const providerId = form.watch("tts/provider");
  const provider = getProvider(providerId);
  const secretValue = getSecret(secrets, provider?.company, "tts");

  const isDirty = Object.keys(form.formState.dirtyFields).length > 0;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col rounded-xl border md:flex-nowrap"
      >
        <h2 className="px-8 pb-4 pt-6 text-xl font-medium">Text-To-Speech</h2>
        <div className="border-b px-8 pb-8">
          <div className="inline-flex rounded-md border">
            <div
              className={cn(
                "p-2",
                provider?.metrics &&
                  "w-full border-b md:border-b-0 md:border-r",
              )}
            >
              <FormField
                control={form.control}
                name="tts/provider"
                render={({ field }) => (
                  <FormItem key={field.value}>
                    <ProviderSelect
                      value={field.value}
                      onChange={field.onChange}
                      providers={TTS_PROVIDERS}
                    />
                  </FormItem>
                )}
              />

              {provider && (
                <div className="mt-2 p-2">
                  <SecretPopup
                    key={provider.model}
                    provider={provider}
                    secretValue={secretValue}
                    modelType="tts"
                    chatbotName={chatbotName}
                  />
                </div>
              )}
            </div>
            {provider?.metrics && <Metrics metrics={provider.metrics} />}
          </div>

          <div className="mt-4 flex flex-wrap gap-4 md:gap-x-8">
            <FormField
              control={form.control}
              name="tts/voice_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">
                    voice id
                  </FormLabel>
                  <FormControl>
                    <Input className="mt-2 w-40" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tts/greeting"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">
                    greeting (optional)
                  </FormLabel>
                  <FormControl>
                    <Input className="mt-2 w-40" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex items-center justify-between px-8 py-4">
          <p className="text-sm text-muted-foreground">
            learn more about{" "}
            <Link
              href="https://github.com/sshkeda/use-voice"
              className="inline-flex items-center text-blue-500 hover:underline"
              target="_blank"
            >
              text-to-speech
              <ExternalLink className="ml-1 h-[13px] w-[13px]" />
            </Link>
          </p>
          <Button
            type="submit"
            variant="secondary"
            size="sm"
            disabled={!isDirty || form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && <Loader />}
            save
          </Button>
        </div>
      </form>
    </Form>
  );
}

function Metrics({ metrics }: { metrics: Provider["metrics"] }) {
  if (!metrics) return null;

  return (
    <div className="p-4">
      {Object.entries(metrics).map(([metricId, { label, value }]) => (
        <Tooltip key={metricId}>
          <TooltipTrigger asChild>
            <div key={metricId} className="flex justify-between space-x-12">
              <p className="text-muted-foreground">{metricId}</p>
              <span className="ml-2 font-mono">{value}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
