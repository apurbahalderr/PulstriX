"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { color } from 'framer-motion';
import NotificationManager from '@/components/NotificationManager';

export function Navbar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isActive = (path: string) => pathname === path;

    const getNavLinks = () => {
        if (user?.role === 'responder') {
            return [
                { href: '/responder/dashboard', label: 'Dashboard' },
                { href: '/responder', label: 'Manage' },
            ];
        }
        if (user?.role === 'employee') {
            return [
                { href: '/employee', label: 'My Tasks' },
            ];
        }
        
        
        const links = [
            { href: '/', label: 'Home' },
            { href: '/dashboard', label: 'Dashboard' },
            { href: '/report', label: 'Report' },
            { href: '/emergency', label: 'Emergency' },
        ];

        if (user) {
            links.push({ href: '/analytics', label: 'Analytics' });
        }
        
        return links;
    };

    const navLinks = getNavLinks();

    return (
        <nav className="fixed top-4 left-0 right-0 z-50 max-w-[95%] mx-auto px-2 sm:px-4 lg:px-6">
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
                <div className="flex items-center justify-between h-16 px-6 md:px-12">
                    {}
                    <Link href="/" className="flex items-center space-x-2">
                        <Image src="/logo.jpeg" alt="Pulstrix Logo" width={32} height={32} className="object-contain rounded" />
                        <span className="text-xl font-bold tracking-tight text-white">Pulstri<span style={{ color: '#007BFF' }}>X</span></span>
                    </Link>

                    {}
                    <div className="hidden md:flex items-center space-x-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(link.href)
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {}
                    <div className="hidden md:flex items-center space-x-3">
                        <NotificationManager variant="outline" className="border-primary/30 text-primary hover:bg-primary/10" />
                        {user ? (
                            <div className="flex items-center space-x-3">
                                <span className="text-sm text-text-secondary">
                                    Good day, <span className="text-text-primary font-semibold">{user.name}</span>
                                </span>
                                <Button variant="outline" size="sm" onClick={logout}>
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className='flex gap-2'>
                                <Link href="/login">
                                    <Button variant="ghost" size="sm">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/report">
                                    <Button variant="primary" size="sm" className="animate-pulse">
                                        Report Incident
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-text-secondary hover:text-white p-2"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
                {}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-white/10">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(link.href)
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-card'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="pt-4 pb-2 border-t border-border-main mt-2">
                                {user ? (
                                    <div className="flex flex-col space-y-2 px-3">
                                        <span className="text-sm text-text-secondary mb-2">Signed in as {user.name}</span>
                                        <Button variant="outline" onClick={logout} className="w-full">
                                            Logout
                                        </Button>
                                    </div>
                                ) : (
                                    <div className='flex flex-col gap-2 px-3'>
                                        <Link href="/login" className="w-full">
                                            <Button variant="secondary" className="w-full">Login</Button>
                                        </Link>
                                        <Link href="/report" className="w-full">
                                            <Button variant="primary" className="w-full">Report Incident</Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {}
            <div className="md:hidden">
                <NotificationManager
                    className="fixed bottom-6 right-6 z-[100] shadow-xl rounded-full"
                    variant="primary"
                />
            </div>
        </nav >
    );
}
