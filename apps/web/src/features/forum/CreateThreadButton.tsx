"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { GameSlug } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateThreadDialog } from "./CreateThreadDialog";

interface CreateThreadButtonProps {
  gameSlug: GameSlug;
}

export function CreateThreadButton({ gameSlug }: CreateThreadButtonProps) {
  const { data: session } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!session) {
    return (
      <Button onClick={() => (window.location.href = "/auth/signin")}>
        Sign in to Create Thread
      </Button>
    );
  }

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)}>
        <Plus className="w-4 h-4 mr-2" />
        New Thread
      </Button>

      <CreateThreadDialog
        gameSlug={gameSlug}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}
