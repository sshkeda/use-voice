"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createChatbot } from "@/app/(main)/chatbots/actions";
import Loader from "./ui/loader";
import { useRouter } from "next/navigation";

export default function NewChatbot({ allChatbots }: { allChatbots: string[] }) {
  const router = useRouter();
  const FormSchema = z.object({
    name: z
      .string()
      .min(2, {
        message: "Name must be at least 2 characters.",
      })
      .max(50, {
        message: "Name must be at most 50 characters.",
      })
      .regex(/^[a-z0-9._-]+$/, {
        message:
          "Name must only contain lowercase letters, numbers, and the following characters: '.', '_', '-'.",
      })
      .refine((name) => !allChatbots.includes(name), {
        message: "Name is already taken.",
      }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await createChatbot(data.name);

    router.push(`/chatbots/${data.name}`);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="h-20 w-60">
          <Plus className="mr-2 h-5 w-5" /> new chatbot
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new chatbot.</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chatbot name</FormLabel>
                  <FormControl>
                    <Input placeholder="Alex" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="secondary"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && <Loader />}
              create
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
