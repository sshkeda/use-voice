import AccountDropdown from "./account-dropdown";
import ChatbotLinks from "./chatbot-links";
import ChatbotPopover from "./chatbot-popover";
import ChatbotsPopover from "./chatbots-popover";
import { Suspense } from "react";

export default function ChatbotNavbar({
  chatbotName,
}: {
  chatbotName: string;
}) {
  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b backdrop-blur-md bg-background">
      <div className="relative mx-auto max-w-screen-lg px-6 pt-2">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center space-x-2">
            <Suspense
              fallback={
                <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full border bg-background">
                  <div className="h-[16px] w-[16px] rounded-full bg-muted-foreground" />
                </div>
              }
            >
              <ChatbotsPopover chatbotName={chatbotName} />
            </Suspense>
            <ChatbotPopover chatbotName={chatbotName} />
          </div>
          <AccountDropdown />
        </div>
        <div className="mt-2">
          <ChatbotLinks chatbotName={chatbotName} />
        </div>
      </div>
    </nav>
  );
}
