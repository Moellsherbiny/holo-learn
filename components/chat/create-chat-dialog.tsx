"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { createChat } from "@/actions/chat/createChat";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Plus } from "lucide-react";

interface ChatUser {
  id: string;
  name: string | null;
  image: string | null;
  email: string;
}

interface Props {
  users: ChatUser[];
}

export default function CreateChatDialog({ users }: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [isPending, startTransition] = useTransition();

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;

    return users.filter((user) =>
      `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase()),
    );
  }, [users, search]);

  const handleCreateChat = (receiverId: string) => {
    startTransition(async () => {
      const result = await createChat({
        receiverId,
      });

      if (!result.success) {
        toast.error(result.message);

        return;
      }

      toast.success("تم إنشاء المحادثة بنجاح.");

      setOpen(false);

      router.push(`/chat/${result.chat?.id}`);

      router.refresh();
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={isPending}>
          <Plus className="size-4" />

          {isPending ? "جارٍ الإنشاء..." : "محادثة جديدة"}
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 sm:max-w-lg">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>بدء محادثة جديدة</DialogTitle>

          <DialogDescription>
            اختر الشخص الذي تريد بدء محادثة معه.
          </DialogDescription>
        </DialogHeader>

        <Command shouldFilter={false}>
          <CommandInput
            placeholder="ابحث..."
            value={search}
            onValueChange={setSearch}
          />

          <CommandList>
            <CommandEmpty>لا يوجد مستخدمون.</CommandEmpty>

            <CommandGroup>
              {filteredUsers.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.id}
                  disabled={isPending}
                  onSelect={() => handleCreateChat(user.id)}
                  className="cursor-pointer"
                >
                  <Avatar className="size-10">
                    <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />

                    <AvatarFallback>
                      {user.name?.charAt(0).toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-1 flex-col overflow-hidden">
                    <span className="truncate font-medium">
                      {user.name ?? "بدون اسم"}
                    </span>

                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
