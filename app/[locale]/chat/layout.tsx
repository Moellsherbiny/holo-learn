import { ReactNode } from "react";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

interface Props {
  children: ReactNode;
}

export default function ChatLayout({
  children,
}: Props) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}