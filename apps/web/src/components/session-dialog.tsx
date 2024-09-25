import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { sessions } from "@/db/schema";
import Chat from "./chat";

export default function SessionDialog({
  session,
  chatbotName,
}: {
  session: typeof sessions.$inferSelect;
  chatbotName: string;
}) {
  const messages = JSON.parse(session.messages) as {
    role: "user" | "assistant";
    content: string;
  }[];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          key={session.id}
          className="flex w-full justify-between border-b p-2 transition-colors first:rounded-t-md last:rounded-b-md last:border-0 hover:bg-zinc-900"
        >
          <span className="font-mono text-muted-foreground">
            {session.createdAt} | {session.duration.toFixed(2)}s
          </span>
          <span className="font-mono text-muted-foreground">
            <span className="font-sans">{chatbotName}</span> |{" "}
            {session.accessToken}
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-screen-md">
        <DialogHeader>
          <DialogTitle>
            session with {chatbotName} on {session.createdAt}
          </DialogTitle>
          <DialogDescription>
            <p>Duration: {session.duration.toFixed(2)}s</p>
            <p>Access Token: {session.accessToken}</p>
          </DialogDescription>
        </DialogHeader>
        <h3 className="font-semibold">Messages</h3>
        {messages.length == 0 ? (
          <p>no messages</p>
        ) : (
          <Chat messages={messages} className="h-96 rounded-md border" />
        )}
      </DialogContent>
    </Dialog>
  );
}
