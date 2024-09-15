import ChatbotNavbar from "@/components/chatbot-navbar";

export default function ChatbotLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { chatbotName: string };
}) {
  return (
    <div>
      <ChatbotNavbar chatbotName={params.chatbotName} />
      <div className="mx-auto max-w-screen-lg px-2 pt-[89px]">{children}</div>
    </div>
  );
}
