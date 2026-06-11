'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Globe,
  Building2,
  MapPin,
  ChevronRight,
  Globe2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  locale: string;
}

export function AdminSidebar({ locale }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: `/${locale}/admin`,
      label: 'Dashboard',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: `/${locale}/admin/users`,
      label: 'Users',
      icon: Users,
    },
    {
      href: `/${locale}/admin/countries`,
      label: 'Countries',
      icon: Globe,
    },
    {
      href: `/${locale}/admin/cities`,
      label: 'Cities',
      icon: Building2,
    },
    {
      href: `/${locale}/admin/places`,
      label: 'Places',
      icon: MapPin,
    },
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-[#070f25] border-r border-blue-900/20 hidden lg:flex flex-col z-40">
      {/* Logo / Title */}
      <div className="p-6 border-b border-blue-900/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-600/30 flex items-center justify-center">
            <Globe2 className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Admin Panel</p>
            <p className="text-blue-400/60 text-xs">Virtual Travel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                active
                  ? 'bg-blue-600/20 text-white border border-blue-500/30'
                  : 'text-blue-200/60 hover:text-white hover:bg-white/5'
              )}
            >
              <item.icon
                className={cn(
                  'w-4 h-4 flex-shrink-0',
                  active ? 'text-blue-400' : 'text-blue-400/50 group-hover:text-blue-400'
                )}
              />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight className="w-3 h-3 text-blue-400/60" />}
            </Link>
          );
        })}
      </nav>

      {/* Back to site */}
      <div className="p-4 border-t border-blue-900/20">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 px-3 py-2 text-sm text-blue-300/50 hover:text-white transition-colors"
        >
          <Globe2 className="w-4 h-4" />
          Back to Site
        </Link>
      </div>
    </aside>
  );
}
