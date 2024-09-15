"use client";

export default function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="whitespace-pre-wrap rounded-md bg-zinc-900/50 p-2 font-mono text-sm text-muted-foreground">
      {children}
    </div>
  );
}
