"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

/**
 * Wraps public pages with Navbar + Footer.
 * Detects /admin routes and renders children bare so the
 * admin layout can take full control of the viewport.
 */
export default function PublicChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.includes("/admin");

  if (isAdmin) {
    // Admin pages manage their own chrome — no Navbar/Footer
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </>
  );
}
