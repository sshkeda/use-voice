"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { Eye, EyeOff, Key, Pencil, Plus, Trash } from "lucide-react";
import type { Provider } from "@/lib/providers";
import { useState } from "react";
import {
  deleteSecret,
  saveSecret,
} from "@/app/(chatbots)/chatbots/[chatbotName]/config/actions";
import { SECRETS, secretsAtom } from "@/lib/settings";
import { useSetAtom } from "jotai";
import { toast } from "sonner";
import Loader from "./ui/loader";

export default function SecretPopup({
  provider,
  secretValue,
  modelType,
  chatbotName,
}: {
  provider: Provider;
  secretValue: string;
  modelType: "stt" | "tts" | "llm";
  chatbotName: string;
}) {
  const [secretInput, setSecretInput] = useState(secretValue);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showMode, setShowMode] = useState(false);

  const setSecrets = useSetAtom(secretsAtom);

  const secretSettingId = `${modelType}/${provider.company}` as keyof SECRETS;

  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setEditMode(false);
          setShowMode(false);
          setSecretInput("");
        }

        setOpen(open);
      }}
    >
      <PopoverTrigger asChild>
        {secretValue ? (
          <Button
            variant="outline"
            className="group text-muted-foreground"
            size="icon"
          >
            <Key className="h-4 w-4 rotate-45 stroke-muted-foreground transition-colors group-hover:stroke-foreground" />
          </Button>
        ) : (
          <Button
            variant="outline"
            className="group rounded-full text-muted-foreground"
          >
            <Plus className="ransition-colors mr-2 h-4 w-4 stroke-muted-foreground group-hover:stroke-foreground" />
            {provider.company} API Key
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent side="bottom">
        <span className="font-medium">{provider.company} API Key</span>
        <div className="mt-4">
          {secretValue && !editMode ? (
            <div className="group flex items-center justify-between rounded-md bg-zinc-900 p-2">
              <span className="ml-2 w-[158px] break-words text-sm text-muted-foreground">
                {showMode ? secretValue : "•••••••"}
              </span>
              <div className="invisible inline-flex space-x-2 pl-2 group-hover:visible">
                <button onClick={() => setShowMode((m) => !m)}>
                  {showMode ? (
                    <EyeOff className="h-4 w-4 stroke-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 stroke-muted-foreground" />
                  )}
                </button>
                <button onClick={() => setEditMode(true)}>
                  <Pencil className="h-4 w-4 stroke-muted-foreground" />
                </button>
                <button
                  onClick={async () => {
                    setDeleting(true);
                    await deleteSecret(
                      chatbotName,
                      provider.company,
                      modelType,
                    );

                    toast.success(`${provider.company} API Key deleted.`);

                    setSecrets((prev) => {
                      delete prev[secretSettingId];

                      return { ...prev };
                    });

                    setSecretInput("");

                    setDeleting(false);
                  }}
                  disabled={deleting}
                >
                  {deleting ? (
                    <Loader className="mr-0 stroke-muted-foreground" />
                  ) : (
                    <Trash className="h-4 w-4 stroke-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-9 items-center justify-between rounded-md">
              <input
                value={secretInput}
                onChange={(e) => setSecretInput(e.target.value)}
                disabled={submitting}
                className="flex h-9 w-[254px] rounded-md bg-transparent bg-zinc-900 px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button
                variant="secondary"
                className="ml-2"
                size="sm"
                disabled={
                  (secretInput === "" && !editMode) ||
                  submitting ||
                  secretInput === secretValue
                }
                onClick={async () => {
                  setSubmitting(true);

                  await saveSecret(
                    secretInput,
                    provider.company,
                    modelType,
                    chatbotName,
                  );

                  setOpen(false);

                  toast.success(`${provider.company} API Key saved.`);

                  setSecrets((prev) => {
                    prev[secretSettingId] = secretInput;

                    return { ...prev };
                  });

                  setSubmitting(false);
                  setEditMode(false);
                }}
              >
                {submitting && <Loader />}
                save
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
