"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { useState } from "react";
import { deleteChatbot } from "@/app/(main)/chatbots/actions";
import Loader from "./ui/loader";

export default function DeleteChatbot({
  chatbotName,
}: {
  chatbotName: string;
}) {
  const [deleting, setDeleting] = useState(false);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          delete {chatbotName}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            are you sure you want to delete {chatbotName}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            this action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={async () => {
              setDeleting(true);

              await deleteChatbot(chatbotName);
            }}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <Loader /> deleting
              </>
            ) : (
              "delete"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
