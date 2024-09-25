"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm, UseFormReturn } from "react-hook-form";

import { z } from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import Loader from "./ui/loader";
import { useState } from "react";
import {
  createCustomLLM,
  saveChatbotSettings,
} from "@/app/(chatbots)/chatbots/[chatbotName]/config/actions";
import { usePathname } from "next/navigation";
import { useSetAtom } from "jotai";
import { configAtom } from "@/lib/settings";
import { toast } from "sonner";

export const formSchema = z.object({
  model: z.string().min(2).max(50),
  baseURL: z.string().url(),
  apiKey: z.string().optional(),
});

export default function CustomLLM({
  open,
  setOpen,
  rootForm,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  rootForm: UseFormReturn;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      model: "",
      baseURL: "",
      apiKey: "",
    },
  });
  const setConfig = useSetAtom(configAtom);
  const pathname = usePathname();
  const chatbotName = pathname.split("/")[2];
  const [pending, setPending] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setPending(true);

    const changes = { "llm/provider": `Custom/${values.model}` };
    await createCustomLLM(values, chatbotName);
    await saveChatbotSettings(changes, chatbotName, "config");

    toast.success("Custom LLM model created.");

    setConfig((prev) => {
      const newConfig = { ...prev, ...changes };
      rootForm.reset(newConfig);
      return newConfig;
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Custom LLM Model</DialogTitle>
          <DialogDescription className="mt-2">
            must be OpenAI compatible
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model ID</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="baseURL"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={!form.formState.isValid || pending}
              variant="secondary"
              type="submit"
            >
              {pending && <Loader />}
              create
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
