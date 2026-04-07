import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminUserButton from "@/components/admin/AdminUserButton";
import SessionProviderWrapper from "@/components/admin/SessionProviderWrapper";
import { ArrowLeft } from "lucide-react";

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export default async function AdminLayout({ children, params }: Props) {
  const { locale } = await Promise.resolve(params);

  return (
    <SessionProviderWrapper>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        {/* Fixed sidebar */}
        <AdminSidebar />

        {/* Scrollable content pane */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Admin top bar: back-to-site on left, user info + sign-out on right */}
          <div className="h-11 shrink-0 flex items-center justify-between px-4 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
            {/* Left: back to public site */}
            <a
              href={`/${locale}`}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-primary transition-colors group"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to Site</span>
            </a>

            {/* Right: signed-in admin info + sign-out */}
            <AdminUserButton locale={locale} />
          </div>

          {children}
        </div>
      </div>
    </SessionProviderWrapper>
  );
}
