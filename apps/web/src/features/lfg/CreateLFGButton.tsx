"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { GameSlug } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateLFGDialog } from "./CreateLFGDialog";

interface CreateLFGButtonProps {
  gameSlug: GameSlug;
}

export function CreateLFGButton({ gameSlug }: CreateLFGButtonProps) {
  const { data: session } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!session) {
    return (
      <Button onClick={() => (window.location.href = "/auth/signin")}>
        Sign in to Post LFG
      </Button>
    );
  }

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)}>
        <Plus className="w-4 h-4 mr-2" />
        Post LFG
      </Button>

      <CreateLFGDialog
        gameSlug={gameSlug}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}
