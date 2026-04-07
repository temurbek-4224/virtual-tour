"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, usePathname } from "next/navigation";
import { Globe } from "lucide-react";

// Inline Google icon — no extra dependency needed
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function LoginPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname(); // e.g. "/en/login", "/uz/login"
  const locale = pathname.split("/")[1] ?? "en";

  // After sign-in, return to wherever the user came from, or the public home
  const callbackUrl = searchParams.get("callbackUrl") ?? `/${locale}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-sm">

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

          {/* Top accent bar */}
          <div className="h-1 bg-gradient-to-r from-primary via-blue-500 to-indigo-500" />

          <div className="p-8">
            {/* Brand */}
            <div className="flex flex-col items-center mb-8">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Globe className="h-7 w-7 text-primary" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 text-center">
                Sign In
              </h1>
              <p className="text-sm text-gray-400 mt-1 text-center">
                Virtual Tour Uzbekistan
              </p>
            </div>

            {/* Google button */}
            <button
              onClick={() => signIn("google", { callbackUrl })}
              className="w-full flex items-center justify-center gap-3 h-11 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm font-medium text-gray-700 shadow-sm"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            {/* Info notice */}
            <p className="mt-5 text-center text-xs text-gray-400 leading-relaxed">
              Anyone can sign in. Admin users will see an{" "}
              <strong className="text-gray-600">Admin Panel</strong> button after signing in.
            </p>
          </div>
        </div>

        {/* Back link */}
        <p className="text-center mt-5 text-xs text-gray-400">
          <a
            href={`/${locale}`}
            className="hover:text-gray-600 transition-colors"
          >
            ← Back to public site
          </a>
        </p>
      </div>
    </div>
  );
}
