import Link from 'next/link';
import { Home, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-blue-900/30 mb-4">404</div>
        <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-600/30 flex items-center justify-center mx-auto mb-6">
          <MapPin className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-blue-200/60 mb-8 leading-relaxed">
          The destination you're looking for doesn't exist or may have moved.
        </p>
        <Button asChild>
          <Link href="/">
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
