import { ReactNode } from 'react';
import { useAuth } from '@/app/providers';
import { Nav } from './nav';
import { useRouter } from 'next/navigation';

interface LayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requireSales?: boolean;
}

export function Layout({ 
  children, 
  requireAuth = true,
  requireAdmin = false,
  requireSales = false
}: LayoutProps) {
  const { isLoading, session, isAdmin, isSales } = useAuth();
  const router = useRouter();

  // Handle authentication and authorization
  if (requireAuth && !isLoading && !session) {
    router.push('/login');
    return null;
  }

  if (requireAdmin && !isAdmin) {
    router.push('/dashboard');
    return null;
  }

  if (requireSales && !isAdmin && !isSales) {
    router.push('/dashboard');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {session && <Nav />}
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}