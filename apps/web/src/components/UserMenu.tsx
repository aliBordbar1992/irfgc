"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, LogOut, Shield, ExternalLink } from "lucide-react";
import { NotificationBadge } from "@/components/NotificationBadge";
import { getPublicProfileUrl } from "@/lib/utils";

export function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 animate-pulse rounded-full bg-[var(--irfgc-surface)]" />
        <div className="h-4 w-16 animate-pulse rounded bg-[var(--irfgc-surface)]" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/auth/signup"
          className="rounded-lg border border-[var(--irfgc-border)] px-5 py-[7px] text-sm font-semibold text-[var(--irfgc-text-primary)] transition-colors hover:bg-[var(--irfgc-surface)]"
          dir="auto"
        >
          ثبت‌نام
        </Link>
        <Link
          href="/auth/signin"
          className="text-sm text-[var(--irfgc-text-secondary)] transition-colors hover:text-[var(--irfgc-text-primary)]"
          dir="auto"
        >
          ورود
        </Link>
      </div>
    );
  }

  const userInitials = session.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={session.user.avatar || undefined}
              alt={session.user.name}
            />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <NotificationBadge />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session.user.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              @{session.user.username}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center">
            <User className="ms-0 me-2 h-4 w-4" />
            <span dir="auto">پروفایل من</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={getPublicProfileUrl(session.user.username)}
            className="flex items-center"
          >
            <ExternalLink className="ms-0 me-2 h-4 w-4" />
            <span dir="auto">پروفایل عمومی</span>
          </Link>
        </DropdownMenuItem>
        {(session.user.role === "ADMIN" ||
          session.user.role === "MODERATOR") && (
          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="flex items-center">
              <Shield className="ms-0 me-2 h-4 w-4" />
              <span dir="auto">داشبورد</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings" className="flex items-center">
            <Settings className="ms-0 me-2 h-4 w-4" />
            <span dir="auto">تنظیمات</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center text-red-600 focus:text-red-600"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="ms-0 me-2 h-4 w-4" />
          <span dir="auto">خروج</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
