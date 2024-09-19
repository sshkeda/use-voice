import VoiceDemo from "@/components/voice-demo";
import GetStarted from "@/components/get-started";
import { Button } from "@/components/ui/button";
import { Book, ChevronRight } from "lucide-react";
import Link from "next/link";
import Balancer from "react-wrap-balancer";
import CodeBlock from "@/components/code-block";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <div className="mx-auto flex max-w-screen-lg flex-col px-4 md:mt-24 md:flex-row">
        <div className="mt-8 md:order-2">
          <VoiceDemo />
        </div>
        <div className="flex flex-grow items-center">
          <div className="w-full text-center md:text-start">
            <h1 className="mt-4 text-2xl font-semibold md:mt-0 md:text-3xl">
              Open-Source Voice Chatbots
            </h1>
            <h2 className="mt-2 text-xl font-medium text-muted-foreground md:text-xl">
              <Balancer>
                effortlessly build human-like AI chatbots with use-voice
              </Balancer>
            </h2>
            <div className="mt-10 flex items-center md:mt-8">
              <GetStarted />
              <Button
                variant="link"
                className="group ml-2 hidden md:inline-flex"
                size="sm"
                asChild
              >
                <Link
                  href="https://github.com/sshkeda/use-voice"
                  target="_blank"
                >
                  documentation
                  <ChevronRight className="ml-1 h-4 w-4 transition-all group-hover:ml-[6px]" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="group ml-2 h-[58px] w-[58px] rounded-2xl md:hidden"
                size="none"
                asChild
              >
                <Link href="https://github.com/sshkeda/use-voice">
                  <Book className="h-[22px] w-[22px]" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-48">
        <div className="mx-auto flex max-w-screen-sm flex-col items-center px-4">
          <div className="mt-4 inline-flex">
            <CodeBlock>
              {`import { useVoice } from `}
              <Link
                href="https://www.npmjs.com/package/use-voice"
                className="font-semibold text-primary"
                target="_blank"
              >
                {`"use-voice"`}
              </Link>
              {`;
                
export default function Chatbot() {
  const { start } = useVoice({ accessToken: `}
              <Link href="signup" className="font-semibold text-primary">
                create chatbot
              </Link>
              {` });
                
  return <button onClick={start}>start chatbot</button>;
}`}
            </CodeBlock>
          </div>
        </div>
      </div>
    </main>
  );
}
