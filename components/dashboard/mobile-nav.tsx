"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetTitle 
} from "@/components/ui/sheet";
import {Sidebar} from "./app-sidebar";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useSession } from "next-auth/react";
export function MobileNav({ locale }: { locale: string }) {
  const { data: session } = useSession();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side={locale === "ar" ? "right" : "left"} 
        className="p-0 w-72"
      >
        <VisuallyHidden>
          <SheetTitle>Navigation Menu</SheetTitle>
        </VisuallyHidden>
        <Sidebar role={session?.user.role} />
      </SheetContent>
    </Sheet>
  );
}