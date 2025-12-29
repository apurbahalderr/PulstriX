'use client';

import React, { useState, useEffect } from 'react';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Report } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
    Users,
    MapPin,
    Shield,
    ChevronDown,
    ChevronUp,
    Phone,
    Mail,
    Plus,
    Building
} from 'lucide-react';



export default function ResponderPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    
    const [incidents, setIncidents] = useState<Report[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);
    const [showEmployees, setShowEmployees] = useState(false);
    const [newEmployeeEmail, setNewEmployeeEmail] = useState('');
    const [isAddingEmployee, setIsAddingEmployee] = useState(false);

    
    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'responder')) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    
    useEffect(() => {
        const fetchIncidents = async () => {
            try {
                const res = await fetch('/api/report');
                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        setIncidents(data.data);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch incidents', error);
            }
        };

        fetchIncidents();
    }, []);

    
    const fetchEmployees = async () => {
        if (!user?._id) return;
        try {
            const res = await fetch(`/api/responder/employees?responderId=${user._id}`);
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    setEmployees(data.data);
                }
            }
        } catch (error) {
            console.error('Failed to fetch employees', error);
        }
    };

    const handleAddEmployee = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?._id || !newEmployeeEmail) return;

        setIsAddingEmployee(true);
        try {
            const res = await fetch('/api/addEmployees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    responderId: user._id,
                    emails: [newEmployeeEmail]
                })
            });

            const data = await res.json();
            if (data.success) {
                alert('Employee added successfully!');
                setNewEmployeeEmail('');
                fetchEmployees(); 
            } else {
                alert(data.message || 'Failed to add employee');
            }
        } catch (error) {
            alert('Error adding employee');
        } finally {
            setIsAddingEmployee(false);
        }
    };

    if (isLoading || !user) return <div className="min-h-screen bg-bg-main pt-24 flex items-center justify-center text-white">Loading...</div>;

    
    const resolvedCount = incidents.filter(inc => {
        const lastResponderId = inc.responderId && inc.responderId.length > 0 
            ? inc.responderId[inc.responderId.length - 1] 
            : null;
        return inc.status === 'resolved' && lastResponderId === user._id;
    }).length;

    const assignedCount = incidents.filter(inc => {
        const lastResponderId = inc.responderId && inc.responderId.length > 0 
            ? inc.responderId[inc.responderId.length - 1] 
            : null;
        return inc.status !== 'resolved' && lastResponderId === user._id;
    }).length;

    return (
        <div className="min-h-screen bg-bg-main flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl bg-bg-card border-border-main shadow-xl">
                <CardHeader className="border-b border-border-main">
                    <CardTitle className="text-2xl text-center text-white flex items-center justify-center gap-3">
                        <Shield className="text-primary" size={32} />
                        Responder Profile
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 pt-6">
                    {}
                    <div className="flex flex-col items-center space-y-3">
                        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary border-2 border-primary/20">
                            <span className="text-3xl font-bold">{user.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                            <p className="text-text-secondary font-medium flex items-center gap-1 justify-center"><Building size={16} />{user.department || 'Emergency Response Unit'}</p>
                        </div>
                        
                        <div className="flex flex-wrap justify-center gap-4 mt-2">
                            {user.address && (
                                <div className="flex items-center gap-2 text-text-muted bg-bg-main px-3 py-1.5 rounded-full border border-border-main">
                                    <MapPin size={16} />
                                    <span className="text-sm">{user.address}</span>
                                </div>
                            )}
                            {user.location && (
                                <div className="flex items-center gap-2 text-text-muted bg-bg-main px-3 py-1.5 rounded-full border border-border-main">
                                    <MapPin size={16} />
                                    <span className="text-sm">Lat: {user.location.lat.toFixed(4)}, Lng: {user.location.lng.toFixed(4)}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-bg-main p-6 rounded-xl border border-border-main text-center hover:border-status-resolved/50 transition-colors">
                            <div className="text-4xl font-bold text-status-resolved mb-1">{resolvedCount}</div>
                            <div className="text-sm text-text-muted font-medium uppercase tracking-wide">Resolved Incidents</div>
                        </div>
                        <div className="bg-bg-main p-6 rounded-xl border border-border-main text-center hover:border-primary/50 transition-colors">
                            <div className="text-4xl font-bold text-primary mb-1">{assignedCount}</div>
                            <div className="text-sm text-text-muted font-medium uppercase tracking-wide">Active Assignments</div>
                        </div>
                    </div>

                    {}
                    <div className="space-y-4 pt-4 border-t border-border-main">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Users size={20} /> Team Management
                            </h3>
                        </div>

                        {}
                        <div className="bg-bg-main p-4 rounded-lg border border-border-main">
                            <label className="text-sm text-text-secondary mb-2 block">Add New Team Member</label>
                            <form onSubmit={handleAddEmployee} className="flex gap-2">
                                <Input
                                    placeholder="Enter employee email address"
                                    value={newEmployeeEmail}
                                    onChange={(e) => setNewEmployeeEmail(e.target.value)}
                                    type="email"
                                    className="flex-1"
                                />
                                <Button className='flex gap-1' type="submit" isLoading={isAddingEmployee}>
                                   <Plus size={16} /> <span>Add</span>
                                </Button>
                            </form>
                        </div>

                        {}
                        <Button
                            variant="outline"
                            className="w-full justify-between"
                            onClick={() => {
                                setShowEmployees(!showEmployees);
                                if (!showEmployees && employees.length === 0) fetchEmployees();
                            }}
                        >
                            <span>View Team Members ({employees.length})</span>
                            {showEmployees ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </Button>

                        {}
                        {showEmployees && (
                            <div className="space-y-2 animate-in slide-in-from-top-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                                {employees.length === 0 ? (
                                    <div className="text-center py-8 bg-bg-main rounded-lg border border-border-main border-dashed">
                                        <p className="text-text-muted">No team members found.</p>
                                    </div>
                                ) : (
                                    employees.map(emp => (
                                        <div key={emp._id} className="bg-bg-main p-3 rounded-lg border border-border-main flex items-center justify-between hover:border-primary/30 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-bg-secondary flex items-center justify-center text-text-secondary text-xs font-bold">
                                                    {emp.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white text-sm">{emp.name}</div>
                                                    <div className="text-xs text-text-muted">{emp.email}</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <a href={`tel:${emp.phone}`} className="p-2 text-text-secondary hover:text-primary hover:bg-bg-secondary rounded-full transition-colors" title="Call">
                                                    <Phone size={14} />
                                                </a>
                                                <a href={`mailto:${emp.email}`} className="p-2 text-text-secondary hover:text-primary hover:bg-bg-secondary rounded-full transition-colors" title="Email">
                                                    <Mail size={14} />
                                                </a>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
