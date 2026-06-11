'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useSession, signOut } from 'next-auth/react';
import { Globe, Menu, X, ChevronDown, User, LogOut, Settings, MapPin, Orbit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from './language-switcher';

interface NavbarProps {
  locale: string;
}

export function Navbar({ locale }: NavbarProps) {
  const t = useTranslations('nav');
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const navLinks: { href: string; label: string; icon?: React.ComponentType<{ className?: string }> }[] = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/destinations`, label: t('destinations') },
    { href: `/${locale}/panorama`, label: t('tour'), icon: Orbit },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[#050b1f]/95 backdrop-blur-xl border-b border-blue-900/30 shadow-lg shadow-black/20'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2.5 group"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold">
              <span className="text-white">Virtual</span>
              <span className="text-gradient"> Travel</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  pathname === link.href
                    ? 'text-white bg-blue-600/20 border border-blue-500/30'
                    : 'text-blue-200/70 hover:text-white hover:bg-white/5'
                )}
              >
                {link.icon && <link.icon className="w-3.5 h-3.5" />}
                {link.label}
              </Link>
            ))}
            {session?.user?.role === 'ADMIN' && (
              <Link
                href={`/${locale}/admin`}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  pathname.includes('/admin')
                    ? 'text-white bg-blue-600/20 border border-blue-500/30'
                    : 'text-blue-200/70 hover:text-white hover:bg-white/5'
                )}
              >
                <Settings className="inline w-4 h-4 mr-1.5" />
                {t('admin')}
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher currentLocale={locale} />

            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-blue-900/20 border border-blue-800/30 hover:border-blue-600/40 transition-all duration-200"
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name ?? 'User'}
                      width={28}
                      height={28}
                      className="rounded-full ring-2 ring-blue-500/30"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-white max-w-[120px] truncate">
                    {session.user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 text-blue-300 transition-transform',
                      userMenuOpen && 'rotate-180'
                    )}
                  />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 glass-card border border-blue-800/40 shadow-xl shadow-black/30 py-1 animate-fade-in">
                    <div className="px-4 py-2 border-b border-blue-800/30">
                      <p className="text-sm font-medium text-white truncate">
                        {session.user?.name}
                      </p>
                      <p className="text-xs text-blue-300/70 truncate">{session.user?.email}</p>
                      {session.user?.role === 'ADMIN' && (
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-blue-600/30 text-blue-300 rounded-full border border-blue-500/30">
                          Admin
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => signOut({ callbackUrl: `/${locale}` })}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('signOut')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  import('next-auth/react').then(({ signIn }) => signIn('google'));
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40"
              >
                {t('signIn')}
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-blue-200/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#050b1f]/98 backdrop-blur-xl border-b border-blue-900/30 animate-fade-in">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'text-white bg-blue-600/20 border border-blue-500/30'
                    : 'text-blue-200/70 hover:text-white hover:bg-white/5'
                )}
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                {link.label}
              </Link>
            ))}
            {session?.user?.role === 'ADMIN' && (
              <Link
                href={`/${locale}/admin`}
                className="block px-4 py-3 rounded-lg text-sm font-medium text-blue-200/70 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Settings className="inline w-4 h-4 mr-1.5" />
                {t('admin')}
              </Link>
            )}

            <div className="pt-2 border-t border-blue-900/30">
              <div className="px-4 py-2">
                <LanguageSwitcher currentLocale={locale} />
              </div>
            </div>

            {session ? (
              <div className="pt-2 border-t border-blue-900/30">
                <div className="flex items-center gap-3 px-4 py-3">
                  {session.user?.image && (
                    <Image
                      src={session.user.image}
                      alt={session.user.name ?? 'User'}
                      width={36}
                      height={36}
                      className="rounded-full ring-2 ring-blue-500/30"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium text-white">{session.user?.name}</p>
                    <p className="text-xs text-blue-300/60">{session.user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: `/${locale}` })}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  {t('signOut')}
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-blue-900/30">
                <button
                  onClick={() => {
                    import('next-auth/react').then(({ signIn }) => signIn('google'));
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-colors"
                >
                  {t('signIn')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
