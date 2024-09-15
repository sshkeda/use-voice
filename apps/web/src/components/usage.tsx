"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sessions } from "@/db/schema";
import SessionDialog from "./session-dialog";
import { atom, useAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { useState } from "react";
import { loadMoreSessions } from "@/app/(chatbots)/chatbots/[chatbotName]/usage/actions";
import Loader from "./ui/loader";
import { useRouter } from "next/navigation";

const sessionsAtom = atom<(typeof sessions.$inferSelect)[]>([]);

export default function Usage({
  pageSessions,
  chatbots,
}: {
  pageSessions: (typeof sessions.$inferSelect)[];
  chatbots: { [chatbotId: string]: string };
}) {
  useHydrateAtoms([[sessionsAtom, pageSessions]]);
  const [allSessions, setSessions] = useAtom(sessionsAtom);
  const [showLoadMore, setShowLoadMore] = useState(pageSessions.length === 25);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <div className="mt-6">
      <Card>
        <CardHeader>
          <CardTitle>session history</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-zinc-900/50">
            {allSessions.length === 0 ? (
              <div className="flex w-full justify-center p-2">
                <span className="font-mono text-muted-foreground">
                  no sessions
                </span>
              </div>
            ) : (
              allSessions.map((session) => (
                <SessionDialog
                  key={session.id}
                  session={session}
                  chatbotName={chatbots[session.chatbotId]}
                />
              ))
            )}
          </div>
          {showLoadMore && (
            <Button
              variant="outline"
              className="mt-4 w-full"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                const newSessions = await loadMoreSessions(allSessions.length);

                if (newSessions.length !== 25) {
                  setShowLoadMore(false);
                }

                setSessions((prev) => [...prev, ...newSessions]);
                setLoading(false);
              }}
            >
              {loading && <Loader />}
              load more
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
