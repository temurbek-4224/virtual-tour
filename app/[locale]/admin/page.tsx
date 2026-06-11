import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Users, Globe, Building2, MapPin, TrendingUp, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

async function getDashboardStats() {
  const [userCount, countryCount, cityCount, placeCount, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.country.count(),
    prisma.city.count(),
    prisma.place.count(),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, name: true, email: true, image: true, role: true, createdAt: true },
    }),
  ]);
  return { userCount, countryCount, cityCount, placeCount, recentUsers };
}

export default async function AdminDashboard({ params: { locale } }: { params: { locale: string } }) {
  const session = await getServerSession(authOptions);
  const { userCount, countryCount, cityCount, placeCount, recentUsers } = await getDashboardStats();

  const stats = [
    { label: 'Total Users', value: userCount, icon: Users, href: `/${locale}/admin/users`, color: 'blue' },
    { label: 'Countries', value: countryCount, icon: Globe, href: `/${locale}/admin/countries`, color: 'cyan' },
    { label: 'Cities', value: cityCount, icon: Building2, href: `/${locale}/admin/cities`, color: 'indigo' },
    { label: 'Places', value: placeCount, icon: MapPin, href: `/${locale}/admin/places`, color: 'violet' },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white">Dashboard</h1>
        <p className="text-blue-300/60 mt-1">
          Welcome back, {session?.user?.name?.split(' ')[0]}! Here's your platform overview.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="glass-card-hover p-6 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-600/30 flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
                <stat.icon className="w-5 h-5 text-blue-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-blue-400/40 group-hover:text-blue-400 transition-colors" />
            </div>
            <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
            <div className="text-sm text-blue-300/60">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Recent users */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            Recent Users
          </h2>
          <Link
            href={`/${locale}/admin/users`}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            View all →
          </Link>
        </div>

        <div className="space-y-3">
          {recentUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.image} alt={user.name ?? ''} className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-5 h-5 text-blue-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{user.name || 'Unknown'}</p>
                <p className="text-blue-300/50 text-xs truncate">{user.email}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                    user.role === 'ADMIN'
                      ? 'bg-blue-600/20 text-blue-300 border-blue-500/30'
                      : 'bg-blue-900/30 text-blue-400/60 border-blue-800/30'
                  }`}
                >
                  {user.role}
                </span>
                <span className="text-blue-300/40 text-xs">{formatDate(user.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: `/${locale}/admin/countries`, label: 'Add Country', icon: Globe },
            { href: `/${locale}/admin/cities`, label: 'Add City', icon: Building2 },
            { href: `/${locale}/admin/places`, label: 'Add Place', icon: MapPin },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-3 p-4 rounded-xl border border-blue-800/30 hover:border-blue-600/40 hover:bg-blue-900/20 transition-all group"
            >
              <action.icon className="w-5 h-5 text-blue-400/60 group-hover:text-blue-400 transition-colors" />
              <span className="text-sm font-medium text-blue-200/70 group-hover:text-white transition-colors">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
