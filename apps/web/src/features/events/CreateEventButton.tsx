"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { GameSlug } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateEventDialog } from "./CreateEventDialog";

interface CreateEventButtonProps {
  gameSlug: GameSlug;
}

export function CreateEventButton({ gameSlug }: CreateEventButtonProps) {
  const { data: session } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Only show for admins and moderators
  if (
    !session ||
    (session.user.role !== "admin" && session.user.role !== "moderator")
  ) {
    return null;
  }

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)}>
        <Plus className="w-4 h-4 mr-2" />
        Create Event
      </Button>

      <CreateEventDialog
        gameSlug={gameSlug}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}
