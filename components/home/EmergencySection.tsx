'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Phone, AlertOctagon, Heart, Flame, ShieldAlert, Baby, Globe, Shield, UserCheck, Car, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { createPortal } from 'react-dom';

export function EmergencySection() {
    const [isSOSLoading, setIsSOSLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const checkLocationAndSend = () => {
        setIsSOSLoading(true);
        setShowConfirmModal(false);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                console.log("SOS Location:", position.coords);
                
                try {
                    const sessionId = localStorage.getItem("sessionId");
                    const response = await fetch('/api/sos', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            location: {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            },
                            sessionId: sessionId
                        })
                    });

                    const data = await response.json();
                    
                    if (data.success) {
                        setShowSuccessModal(true);
                    } else {
                        alert("Failed to send SOS: " + (data.error || "Unknown error"));
                    }
                } catch (error) {
                    console.error("SOS Error:", error);
                    alert("Failed to send SOS due to network error.");
                } finally {
                    setIsSOSLoading(false);
                }
            },
            async (error) => {
                console.error("Location error:", error);
                alert("Location access is required to send SOS.");
                setIsSOSLoading(false);
            }
        );
    };

    const handleSOSClick = () => {
        setShowConfirmModal(true);
    };

    const handleCloseSuccess = () => {
        setShowSuccessModal(false);
    };

    const contacts = [
        { name: "Police Control", number: "100", icon: <ShieldAlert size={24} />, color: "text-alert-critical", bg: "bg-alert-critical/10", border: "hover:border-alert-critical" },
        { name: "Ambulance", number: "102", icon: <Heart size={24} />, color: "text-alert-high", bg: "bg-alert-high/10", border: "hover:border-alert-high" },
        { name: "Fire Brigade", number: "101", icon: <Flame size={24} />, color: "text-alert-medium", bg: "bg-alert-medium/10", border: "hover:border-alert-medium" },
        { name: "Women's Helpline", number: "1091", icon: <Shield size={24} />, color: "text-pink-500", bg: "bg-pink-500/10", border: "hover:border-pink-500" },
        { name: "Child Helpline", number: "1098", icon: <Baby size={24} />, color: "text-blue-400", bg: "bg-blue-400/10", border: "hover:border-blue-400" },
        { name: "Cyber Crime", number: "1930", icon: <Globe size={24} />, color: "text-purple-500", bg: "bg-purple-500/10", border: "hover:border-purple-500" },
        { name: "Senior Citizen", number: "14567", icon: <UserCheck size={24} />, color: "text-green-500", bg: "bg-green-500/10", border: "hover:border-green-500" },
        { name: "Traffic Police", number: "103", icon: <Car size={24} />, color: "text-yellow-500", bg: "bg-yellow-500/10", border: "hover:border-yellow-500" },
    ];

    return (
        <section className="bg-bg-card py-24 border-t border-border-main relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-alert-critical/5 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col space-y-20">

                    <div className="w-full flex flex-col items-center justify-center text-center">
                        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-alert-critical/10 text-alert-critical border border-alert-critical/20 mb-8">
                            <AlertOctagon size={16} className="animate-pulse" />
                            <span className="text-xs font-bold tracking-widest uppercase">Emergency Response</span>
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-0 bg-alert-critical/20 rounded-full blur-3xl animate-pulse group-hover:bg-alert-critical/30 transition-all duration-500"></div>
                            <button
                                onClick={handleSOSClick}
                                disabled={isSOSLoading}
                                className="relative h-64 w-64 rounded-full bg-gradient-to-br from-red-600 to-red-800 shadow-[0_0_50px_rgba(220,38,38,0.5)] flex flex-col items-center justify-center transform hover:scale-105 active:scale-95 transition-all duration-300 border-8 border-red-500/30 group-hover:border-red-400/50 cursor-pointer"
                            >
                                <AlertOctagon size={64} className="text-white mb-3 group-hover:rotate-12 transition-transform duration-300" />
                                <span className="text-4xl font-black text-white tracking-widest drop-shadow-lg">{isSOSLoading ? '...' : 'SOS'}</span>
                                <span className="text-xs text-red-100 mt-2 uppercase font-bold tracking-wider opacity-80">Press for Help</span>
                            </button>
                        </div>

                        <div className="mt-8 max-w-md mx-auto">
                            <h3 className="text-2xl font-bold text-white mb-3">Silent Distress Signal</h3>
                            <p className="text-text-secondary leading-relaxed">
                                Sends an immediate <strong>Critical Priority</strong> alert to all nearby responders with your live location.
                            </p>
                        </div>
                    </div>

                    <div className="w-full">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Essential Helplines</h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {contacts.map((contact, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center p-4 bg-bg-secondary/50 backdrop-blur-sm rounded-xl border border-border-main ${contact.border} transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group`}
                                >
                                    <div className={`h-12 w-12 rounded-lg ${contact.bg} flex items-center justify-center ${contact.color} mr-4 shadow-inner group-hover:scale-110 transition-transform`}>
                                        {contact.icon}
                                    </div>
                                    <div className="flex-grow">
                                        <div className="text-white font-bold text-lg">{contact.name}</div>
                                        <div className="text-text-muted font-mono">{contact.number}</div>
                                    </div>
                                    <div>
                                        <a href={`tel:${contact.number}`}>
                                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-white/70 hover:text-white">
                                                <Phone size={18} />
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {typeof document !== 'undefined' && createPortal(
                <>
                    {showConfirmModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 p-4">
                            <div className="bg-bg-card border-2 border-alert-critical max-w-sm w-full rounded-2xl p-6 shadow-2xl relative">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-alert-critical/20 rounded-full flex items-center justify-center mx-auto mb-4 text-alert-critical">
                                        <AlertTriangle size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Confirm SOS</h3>
                                    <p className="text-text-secondary mb-6">
                                        Are you sure? This will send your live location to emergency responders immediately.
                                    </p>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => setShowConfirmModal(false)}
                                            className="flex-1 py-3 bg-bg-secondary hover:bg-bg-main text-white font-medium rounded-xl border border-border-main transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={checkLocationAndSend}
                                            className="flex-1 py-3 bg-alert-critical hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-900/30 transition-colors"
                                        >
                                            Yes, Send it
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {showSuccessModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 p-4">
                            <div className="bg-bg-card border-2 border-status-resolved max-w-sm w-full rounded-2xl p-6 shadow-2xl relative">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-status-resolved/20 rounded-full flex items-center justify-center mx-auto mb-4 text-status-resolved">
                                        <CheckCircle size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">SOS Sent!</h3>
                                    <p className="text-text-secondary mb-6">
                                        Authorities have been notified with your location. Please stay calm and wait for assistance.
                                    </p>
                                    <button
                                        onClick={handleCloseSuccess}
                                        className="w-full py-3 bg-status-resolved hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-900/30 transition-colors"
                                    >
                                        Okay, I understand
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>,
                document.body
            )}
        </section>
    );
}
