import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { Users, Shield, User } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PromoteUserButton } from '@/components/admin/promote-user-button';

async function getUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export default async function AdminUsersPage({ params: { locale } }: { params: { locale: string } }) {
  const users = await getUsers();

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Users</h1>
          <p className="text-blue-300/60 mt-1">{users.length} registered users</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-blue-900/20 flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-white">All Users</span>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {user.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.image}
                          alt={user.name ?? ''}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-blue-300" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm">{user.name || '—'}</p>
                      <p className="text-blue-300/40 text-xs">#{user.id.slice(0, 8)}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-blue-200/70">{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                    className="gap-1"
                  >
                    {user.role === 'ADMIN' ? (
                      <Shield className="w-3 h-3" />
                    ) : (
                      <User className="w-3 h-3" />
                    )}
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-blue-200/60 text-sm">
                  {formatDate(user.createdAt)}
                </TableCell>
                <TableCell>
                  <PromoteUserButton
                    userId={user.id}
                    currentRole={user.role}
                    locale={locale}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {users.length === 0 && (
          <div className="p-12 text-center text-blue-300/40">No users found.</div>
        )}
      </div>
    </div>
  );
}
