"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { UserPlus, Heart, MessageCircle, Calendar } from "lucide-react";

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: "follow" | "comment" | "react" | "register" | "custom";
  customTitle?: string;
  customMessage?: string;
  showSignUp?: boolean;
}

const ACTION_CONFIG = {
  follow: {
    icon: UserPlus,
    title: "Follow Users",
    message:
      "Join our community to follow users and stay updated with their activities!",
    actionText: "following users",
  },
  comment: {
    icon: MessageCircle,
    title: "Join the Discussion",
    message: "Sign in to share your thoughts and engage with the community!",
    actionText: "commenting",
  },
  react: {
    icon: Heart,
    title: "Show Your Reaction",
    message: "Sign in to react to posts and show your support!",
    actionText: "reacting to content",
  },
  register: {
    icon: Calendar,
    title: "Register for Events",
    message:
      "Join our community to register for events and connect with other gamers!",
    actionText: "registering for events",
  },
  custom: {
    icon: UserPlus,
    title: "Sign In Required",
    message: "You need to be signed in to perform this action.",
    actionText: "continuing",
  },
};

export function LoginPromptModal({
  isOpen,
  onClose,
  action,
  customTitle,
  customMessage,
  showSignUp = true,
}: LoginPromptModalProps) {
  const config = ACTION_CONFIG[action];
  const Icon = config.icon;

  const handleSignIn = () => {
    signIn();
    onClose();
  };

  const handleSignUp = () => {
    // Navigate to sign up page
    window.location.href = "/auth/signup";
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Icon className="w-5 h-5 text-blue-600" />
            </div>
            <DialogTitle className="text-lg">
              {customTitle || config.title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-gray-600">
            {customMessage || config.message}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-700 text-center">
              ✨ Create an account to unlock all features including{" "}
              {config.actionText}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {showSignUp && (
              <Button onClick={handleSignUp} className="w-full">
                Create Account
              </Button>
            )}
            <Button
              variant={showSignUp ? "outline" : "default"}
              onClick={handleSignIn}
              className="w-full"
            >
              Sign In
            </Button>
          </div>

          <div className="text-center">
            <Button variant="ghost" onClick={onClose} className="text-sm">
              Maybe later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
