'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export function RouteGuard({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        if (isLoading) return;

        
        if (!user) {
            const publicRoutes = ['/', '/login', '/dashboard', '/emergency', '/report'];
            const isPublicRoute = publicRoutes.some(route => 
                pathname === route || pathname.startsWith(`${route}/`)
            );

            if (isPublicRoute) {
                setAuthorized(true);
            } else {
                router.push('/login');
            }
            return;
        }

        if (user.role === 'responder') {
            if (pathname.startsWith('/responder')) {
                setAuthorized(true);
            } else {
                router.push('/responder/dashboard');
            }
            return;
        }

        
        if (user.role === 'employee') {
            
            if (pathname.startsWith('/employee')) {
                setAuthorized(true);
            } else {
                
                router.push('/employee');
            }
            return;
        }

        
        
        if (pathname.startsWith('/responder') || pathname.startsWith('/employee')) {
            router.push('/');
            return;
        }

        
        if (pathname === '/login') {
            router.push('/');
            return;
        }

        setAuthorized(true);

    }, [user, isLoading, pathname, router]);

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-bg-main">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    return authorized ? <>{children}</> : null;
}
