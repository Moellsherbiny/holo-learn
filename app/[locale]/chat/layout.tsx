import { ReactNode } from "react";

import { getChats } from "@/actions/chat/getChats";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ChatSidebar from "@/components/chat/chat-sidebar";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface Props {
  children: ReactNode;
}

export default async function ChatLayout({ children }: Props) {
  const result = await getChats();

  if (!result.success) {
    return (
      <>
        <Navbar />

        <main className="container flex min-h-[calc(100vh-9rem)] items-center justify-center">
          <p className="text-muted-foreground">
            {result.message ?? "حدث خطأ أثناء تحميل المحادثات."}
          </p>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="h-[calc(100vh-9rem)] p-6">
  <div className="h-full overflow-hidden rounded-2xl border bg-background shadow-sm">
    <ResizablePanelGroup
      orientation="horizontal"
      className="h-full"
    >
      <ResizablePanel
        defaultSize={28}
        minSize={24}
        maxSize={200}
      >
        <ChatSidebar chats={result.data ?? []} />
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={72}>
        <div className="h-full">
          {children}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
</main>

      <Footer />
    </>
  );
}