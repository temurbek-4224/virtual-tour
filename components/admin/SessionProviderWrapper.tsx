"use client";

// Thin wrapper that makes the NextAuth session available to client components
// in the admin subtree (e.g. AdminUserButton). The wrapper itself stays minimal
// so the admin layout can remain a server component.

import { SessionProvider } from "next-auth/react";

export default function SessionProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
