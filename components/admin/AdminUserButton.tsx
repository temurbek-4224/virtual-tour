"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { useState } from "react";

interface AdminUserButtonProps {
  /** Current locale, e.g. "en" | "uz" | "ru" — used for the sign-out redirect. */
  locale?: string;
}

export default function AdminUserButton({ locale = "en" }: AdminUserButtonProps) {
  const { data: session } = useSession();
  const [signingOut, setSigningOut] = useState(false);

  if (!session?.user) return null;

  const { name, email, image } = session.user;
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : email?.[0]?.toUpperCase() ?? "A";

  async function handleSignOut() {
    setSigningOut(true);
    await signOut({ callbackUrl: `/${locale}/login` });
  }

  return (
    <div className="flex items-center gap-2">
      {/* Avatar + name */}
      <div className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors">
        {image ? (
          <img
            src={image}
            alt={name ?? "Admin"}
            className="h-7 w-7 rounded-full object-cover border border-gray-200"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center">
            <span className="text-[11px] font-bold text-primary">{initials}</span>
          </div>
        )}
        <span className="text-xs font-medium text-gray-700 hidden sm:block max-w-[120px] truncate">
          {name ?? email}
        </span>
      </div>

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        disabled={signingOut}
        title="Sign out"
        className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
      >
        <LogOut className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{signingOut ? "Signing out…" : "Sign out"}</span>
      </button>
    </div>
  );
}
