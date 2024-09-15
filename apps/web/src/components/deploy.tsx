"use client";

import { Copy, RefreshCw, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { DEPLOY_SETTINGS } from "@/lib/settings";
import {
  deleteAccessToken,
  generateAccessToken,
} from "@/app/(chatbots)/chatbots/[chatbotName]/deploy/actions";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Loader from "./ui/loader";

export default function Deploy({
  pageSettings,
  chatbotName,
}: {
  pageSettings: DEPLOY_SETTINGS;
  chatbotName: string;
}) {
  const accessToken = pageSettings["deploy/access_token"];
  const [generating, setGenerating] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Public Access Token</CardTitle>
      </CardHeader>
      <CardContent>
        {accessToken ? (
          <div className="inline-flex rounded-2xl border">
            <div className="border-r p-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl"
                disabled={deleting}
                onClick={async () => {
                  setDeleting(true);
                  await deleteAccessToken(chatbotName);
                  setDeleting(false);
                }}
              >
                {deleting ? (
                  <Loader />
                ) : (
                  <Trash className="h-5 w-5 stroke-muted-foreground" />
                )}
              </Button>
            </div>
            <div className="border-r p-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl"
                onClick={async () => {
                  setRegenerating(true);
                  await generateAccessToken(chatbotName);
                  setRegenerating(false);
                }}
                disabled={regenerating}
              >
                <RefreshCw
                  className={cn(
                    "h-5 w-5 stroke-muted-foreground",
                    regenerating && "animate-spin",
                  )}
                />
              </Button>
            </div>
            <div className="flex items-center justify-center px-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(accessToken);
                  toast("Access token copied to clipboard.");
                }}
              >
                <Copy className="h-3 w-3 stroke-muted-foreground" />
              </button>
              <span className="ml-2 font-mono text-sm text-muted-foreground">
                {accessToken}
              </span>
            </div>
          </div>
        ) : (
          <Button
            className="mt-4"
            variant="outline"
            disabled={generating}
            onClick={async () => {
              setGenerating(true);
              await generateAccessToken(chatbotName);
              setGenerating(false);
            }}
          >
            {generating && <Loader />}
            generate
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
