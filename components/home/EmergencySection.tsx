'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Phone, AlertOctagon, Heart, Flame, ShieldAlert } from 'lucide-react';

export function EmergencySection() {
    const [isSOSLoading, setIsSOSLoading] = useState(false);
    const [sosSent, setSosSent] = useState(false);

    const handleSOS = async () => {
        if (!confirm("Are you sure? This will send an immediate distress signal with your location.")) return;

        setIsSOSLoading(true);

        // Simulate API call to create Emergency High Priority incident
        // In real implementation: await fetch('/api/incidents', { method: 'POST', body: JSON.stringify({ type: 'Emergency', priority: 'Critical', ... }) })

        // Attempt to get location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log("SOS Location:", position.coords);
                // Simulate network delay
                setTimeout(() => {
                    setIsSOSLoading(false);
                    setSosSent(true);
                    // Alert user
                    alert("SOS Signal Sent! Authorities have been notified.");
                }, 2000);
            },
            (error) => {
                console.error("Location error:", error);
                alert("Location access needed for SOS. Sending manual alert...");
                setIsSOSLoading(false);
            }
        );
    };

    return (
        <div className="bg-bg-card py-16 border-t border-border-main">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12 items-center">

                    {/* Emergency Numbers */}
                    <div>
                        <div className="inline-flex items-center space-x-2 text-alert-critical mb-4">
                            <ShieldAlert size={24} />
                            <span className="font-bold tracking-wide uppercase">Emergency Contacts</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-6">Immediate Assistance</h2>
                        <p className="text-text-secondary mb-8">
                            For life-threatening emergencies, call these numbers immediately.
                            Operators are available 24/7.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center p-4 bg-bg-secondary rounded-lg border border-border-main hover:border-alert-critical transition-colors cursor-pointer group">
                                <div className="h-12 w-12 rounded-full bg-alert-critical/10 flex items-center justify-center text-alert-critical mr-4 group-hover:scale-110 transition-transform">
                                    <ShieldAlert size={24} />
                                </div>
                                <div>
                                    <div className="text-white font-bold text-lg">Police Control</div>
                                    <div className="text-text-muted">Dial 100</div>
                                </div>
                                <div className="ml-auto">
                                    <Button variant="ghost" size="sm" rightIcon={<Phone size={16} />}>Call</Button>
                                </div>
                            </div>

                            <div className="flex items-center p-4 bg-bg-secondary rounded-lg border border-border-main hover:border-alert-high transition-colors cursor-pointer group">
                                <div className="h-12 w-12 rounded-full bg-alert-high/10 flex items-center justify-center text-alert-high mr-4 group-hover:scale-110 transition-transform">
                                    <Heart size={24} />
                                </div>
                                <div>
                                    <div className="text-white font-bold text-lg">Ambulance</div>
                                    <div className="text-text-muted">Dial 102</div>
                                </div>
                                <div className="ml-auto">
                                    <Button variant="ghost" size="sm" rightIcon={<Phone size={16} />}>Call</Button>
                                </div>
                            </div>

                            <div className="flex items-center p-4 bg-bg-secondary rounded-lg border border-border-main hover:border-alert-medium transition-colors cursor-pointer group">
                                <div className="h-12 w-12 rounded-full bg-alert-medium/10 flex items-center justify-center text-alert-medium mr-4 group-hover:scale-110 transition-transform">
                                    <Flame size={24} />
                                </div>
                                <div>
                                    <div className="text-white font-bold text-lg">Fire Brigade</div>
                                    <div className="text-text-muted">Dial 101</div>
                                </div>
                                <div className="ml-auto">
                                    <Button variant="ghost" size="sm" rightIcon={<Phone size={16} />}>Call</Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SOS Button Area */}
                    <div className="flex flex-col items-center justify-center text-center bg-bg-main p-8 rounded-2xl border border-alert-critical/30 relative overflow-hidden">
                        <div className="absolute inset-0 bg-alert-critical/5 animate-pulse pointer-events-none"></div>

                        <div className="mb-6 relative">
                            <div className="absolute inset-0 bg-alert-critical/20 rounded-full blur-2xl animate-pulse"></div>
                            <button
                                onClick={handleSOS}
                                disabled={isSOSLoading}
                                className="relative h-48 w-48 rounded-full bg-gradient-to-b from-red-500 to-red-700 shadow-2xl shadow-red-900/50 flex flex-col items-center justify-center transform hover:scale-105 active:scale-95 transition-all duration-200 border-4 border-red-400/50 group"
                            >
                                <AlertOctagon size={48} className="text-white mb-2 group-hover:animate-bounce" />
                                <span className="text-2xl font-black text-white tracking-widest">{isSOSLoading ? 'SENDING...' : 'S.O.S'}</span>
                                <span className="text-xs text-red-100 mt-1 uppercase font-semibold">Press for help</span>
                            </button>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">Silent Distress Signal</h3>
                        <p className="text-text-secondary text-sm max-w-sm">
                            Pressing this sends an immediate <strong>Critical Priority</strong> alert to all nearby responders with your live location. Use only in extreme emergencies.
                        </p>
                        {sosSent && (
                            <div className="mt-4 p-3 bg-green-500/20 text-green-400 rounded-lg text-sm font-bold border border-green-500/30">
                                Signal Verified & Sent. Stay calm.
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
