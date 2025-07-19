"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { GameSlug } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateNewsDialog } from "./CreateNewsDialog";

interface CreateNewsButtonProps {
  gameSlug: GameSlug;
}

export function CreateNewsButton({ gameSlug }: CreateNewsButtonProps) {
  const { data: session } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Only show for admins and moderators
  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")
  ) {
    return null;
  }

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)}>
        <Plus className="w-4 h-4 mr-2" />
        Write News
      </Button>

      <CreateNewsDialog
        gameSlug={gameSlug}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}
