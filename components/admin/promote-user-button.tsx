'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Role } from '@prisma/client';
import { Shield, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface Props {
  userId: string;
  currentRole: Role;
  locale: string;
}

export function PromoteUserButton({ userId, currentRole, locale }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleToggle = async () => {
    setLoading(true);
    const newRole = currentRole === Role.ADMIN ? Role.USER : Role.ADMIN;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error('Failed');
      toast({
        title: 'Role updated',
        description: `User role changed to ${newRole}`,
        variant: 'default',
      });
      router.refresh();
    } catch {
      toast({ title: 'Error', description: 'Failed to update role', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      variant={currentRole === Role.ADMIN ? 'destructive' : 'outline'}
      onClick={handleToggle}
      disabled={loading}
      className="gap-1.5 text-xs"
    >
      {currentRole === Role.ADMIN ? (
        <>
          <User className="w-3 h-3" />
          Remove Admin
        </>
      ) : (
        <>
          <Shield className="w-3 h-3" />
          Make Admin
        </>
      )}
    </Button>
  );
}
