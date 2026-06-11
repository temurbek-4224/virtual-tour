import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/sidebar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel — Virtual Travel Platform',
};

export default async function AdminLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect(`/${locale}`);
  }

  return (
    <div className="min-h-screen flex pt-16">
      <AdminSidebar locale={locale} />
      <main className="flex-1 lg:ml-64 p-6 lg:p-8 min-h-screen">{children}</main>
    </div>
  );
}
