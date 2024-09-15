import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

export default function SkyPage() {
  return (
    <div className="mt-16 flex h-[600px]">
      <div className="w-1/2 border-r">
        <div className="mt-20 flex h-[116px] items-center justify-center">
          <h1 className="rounded-xl bg-zinc-900 px-4 py-1 text-2xl font-medium text-muted-foreground">
            free
          </h1>
        </div>
        <div className="flex justify-center p-8">
          <ul>
            <li className="text-muted-foreground">
              <Check className="mr-2 inline-flex h-4 w-4" strokeWidth={3} />
              unlimited minutes
            </li>
            <li className="text-muted-foreground">
              <Check className="mr-2 inline-flex h-4 w-4" strokeWidth={3} />
              free{" "}
              <Link
                href="https://github.com/sshkeda/use-voice"
                target="_blank"
                className="underline"
              >
                code
              </Link>
            </li>
            <li className="text-muted-foreground">
              <Check className="mr-2 inline-flex h-4 w-4" strokeWidth={3} />
              free fun
            </li>
          </ul>
        </div>
      </div>

      <div className="flex-grow">
        <div className="mt-[82px] flex justify-center py-8">
          <h1 className="rounded-md px-4 py-2 text-3xl font-semibold">
            Enterprise
          </h1>
        </div>
        <div className="flex justify-center p-8">
          <ul>
            <li className="font-medium">
              <Check className="mr-2 inline-flex h-4 w-4" strokeWidth={3} />
              custom features
            </li>
            <li className="font-medium">
              <Check className="mr-2 inline-flex h-4 w-4" strokeWidth={3} />
              prioritized support
            </li>
            <li className="font-medium">
              <Check className="mr-2 inline-flex h-4 w-4" strokeWidth={3} />
              better chatbots
            </li>
          </ul>
        </div>
        <div className="mt-16 flex flex-col items-center">
          <Button variant="secondary" asChild>
            <Link
              href="https://cal.com/stephen-shkeda-i80adw/enterprise-call"
              target="_blank"
            >
              Schedule a Call
            </Link>
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            or dm on X @sshkeda
          </p>
        </div>
      </div>
    </div>
  );
}
