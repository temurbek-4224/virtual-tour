"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Menu,
  X,
  LogIn,
  LogOut,
  LayoutDashboard,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const isSignedIn = status === "authenticated";
  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/explore", label: t("explore") },
    { href: "/about", label: t("about") },
  ];

  async function handleSignOut() {
    setSigningOut(true);
    await signOut({ callbackUrl: `/${locale}` });
  }

  function handleSignIn() {
    signIn("google", { callbackUrl: `/${locale}` });
  }

  const { name, email, image } = session?.user ?? {};
  const initials = name
    ? name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : email?.[0]?.toUpperCase() ?? "U";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
              <MapPin className="h-4 w-4" />
            </div>
            <span className="hidden sm:block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {t("tagline")}
            </span>
            <span className="sm:hidden font-bold text-primary">VT</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150",
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:text-foreground hover:bg-accent"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />

            {/* Auth UI — desktop */}
            <div className="hidden md:flex items-center gap-2">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : isSignedIn ? (
                <>
                  {/* Admin Panel button — only for admins */}
                  {/* Use a plain <a> to avoid next-intl double-prefixing the locale */}
                  {isAdmin && (
                    <a
                      href={`/${locale}/admin`}
                      className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      <LayoutDashboard className="h-3.5 w-3.5" />
                      {t("adminPanel")}
                    </a>
                  )}

                  {/* User avatar + name */}
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg">
                    {image ? (
                      <img
                        src={image}
                        alt={name ?? "User"}
                        className="h-7 w-7 rounded-full object-cover border border-border"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center">
                        <span className="text-[11px] font-bold text-primary">
                          {initials}
                        </span>
                      </div>
                    )}
                    <span className="text-xs font-medium text-foreground/80 max-w-[100px] truncate hidden lg:block">
                      {name ?? email}
                    </span>
                  </div>

                  {/* Sign out */}
                  <button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    title={t("signOut")}
                    className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium text-foreground/60 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>{signingOut ? "…" : t("signOut")}</span>
                  </button>
                </>
              ) : (
                /* Sign In button */
                <button
                  onClick={handleSignIn}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  {t("signIn")}
                </button>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex items-center justify-center h-9 w-9 rounded-lg hover:bg-accent transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md pb-4 animate-slide-up">
            <div className="flex flex-col gap-1 pt-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:text-foreground hover:bg-accent"
                  )}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile auth section */}
              <div className="border-t border-border mt-2 pt-3 px-1 flex flex-col gap-1">
                {isLoading ? null : isSignedIn ? (
                  <>
                    {/* User info row */}
                    <div className="flex items-center gap-2 px-3 py-2">
                      {image ? (
                        <img
                          src={image}
                          alt={name ?? "User"}
                          className="h-8 w-8 rounded-full object-cover border border-border"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">
                            {initials}
                          </span>
                        </div>
                      )}
                      <span className="text-sm font-medium text-foreground/80 truncate">
                        {name ?? email}
                      </span>
                    </div>

                    {/* Admin Panel — mobile, admins only */}
                    {isAdmin && (
                      <a
                        href={`/${locale}/admin`}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-primary bg-primary/5 hover:bg-primary/10 transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        {t("adminPanel")}
                      </a>
                    )}

                    {/* Sign out — mobile */}
                    <button
                      onClick={handleSignOut}
                      disabled={signingOut}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      {signingOut ? "Signing out…" : t("signOut")}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleSignIn}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
                  >
                    <LogIn className="h-4 w-4" />
                    {t("signIn")}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
