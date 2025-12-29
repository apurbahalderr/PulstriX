'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Report, User, ReportStatus, ReportSeverity } from '@/types';
import { useAuth } from '@/context/AuthContext';
import {
    Siren,
    CheckCircle,
    ArrowRight,
    UserPlus,
    Send,
    MapPin,
    Search,
    Clock,
    AlertTriangle,
    ImageIcon,
} from 'lucide-react';
import { IncidentCard } from '@/components/incidents/IncidentCard';
import { Badge } from '@/components/ui/Badge';
import dynamic from 'next/dynamic';
import IdleEmployees from '@/components/IdleEmployees';

const LiveMap = dynamic(() => import('@/components/map/LiveMap'), {
    loading: () => <div className="h-full w-full bg-bg-secondary animate-pulse flex items-center justify-center text-text-muted">Loading Map...</div>,
    ssr: false
});

export default function ResponderDashboard() {
    const { user } = useAuth();
    const [incidents, setIncidents] = useState<Report[]>([]);
    const [idleEmployees, setIdleEmployees] = useState<User[]>([]);
    const [selectedIncident, setSelectedIncident] = useState<Report | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [isForwarding, setIsForwarding] = useState(false);

    const responderId = user?._id || user?.id || 'r1';

    const fetchData = async () => {
        try {
            const repRes = await fetch('/api/report');
            const repData = await repRes.json();
            if (repData.success) {
                setIncidents(repData.data);
            }

            if (user?.role === 'responder' || user?.role === 'employee') {
                const empRes = await fetch(`/api/responder/employees?responderId=${responderId}`);
                const empData = await empRes.json();
                if (empData.success) {
                    setIdleEmployees(empData.data);
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, [user, responderId]);

    const handleVote = async (e: React.MouseEvent, id: string, action: 'upvote' | 'downvote') => {
        e.stopPropagation();
    };

    const handleAssign = async (employeeId: string) => {
        if (!selectedIncident) return;
        if (!confirm("Assign this report to selected unit?")) return;

        try {
            const res = await fetch('/api/assign', {
                method: 'POST',
                body: JSON.stringify({
                    responderId: responderId,
                    employeeId,
                    reportId: selectedIncident._id
                })
            });
            const data = await res.json();
            if (data.success) {
                alert("Unit Assigned!");
                fetchData();
                setSelectedIncident(null);
            } else {
                alert("Failed: " + data.message);
            }
        } catch (e) {
            console.error(e);
            alert("Error assigning unit");
        }
    };

    const handleForward = async () => {
        if (!selectedIncident || !user?._id) return;

        setIsForwarding(true);
        try {
            const response = await fetch('/api/forwardReportToAnotherResponder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    reportId: selectedIncident._id,
                    responderId: user._id
                })
            });

            const data = await response.json();
            if (data.success) {
                alert('Report forwarded successfully!');
                setSelectedIncident(null);
                setShowAssignModal(false);
                fetchData();
            } else {
                alert(data.message || 'Failed to forward report');
            }
        } catch (error) {
            console.error('Error forwarding report:', error);
            alert('Failed to forward report');
        } finally {
            setIsForwarding(false);
        }
    };

    const getIdleEmployee = async () => {
        setShowAssignModal(true);
        const res = await fetch("/api/getIdleEmployees").then(res => res.json());
        if (res.success) {
            setIdleEmployees(res.data);
        } else {
            alert("Failed to fetch idle employees: " + res.message);
        }
    }

    const handleStatusChange = async (newStatus: ReportStatus) => {
        if (!selectedIncident) return;
        try {
            const res = await fetch('/api/changeReportStatus', {
                method: 'POST',
                body: JSON.stringify({
                    reportId: selectedIncident._id,
                    status: newStatus
                })
            });
            if (res.ok) {
                fetchData();
                setSelectedIncident(prev => prev ? { ...prev, status: newStatus } : null);
            }
        } catch (e) { console.error(e); }
    };

    const handleSeverityChange = async (newSeverity: ReportSeverity) => {
        if (!selectedIncident) return;
        try {
            const res = await fetch('/api/changeReportStatus', {
                method: 'POST',
                body: JSON.stringify({
                    reportId: selectedIncident._id,
                    severity: newSeverity
                })
            });
            if (res.ok) {
                fetchData();
                setSelectedIncident(prev => prev ? { ...prev, severity: newSeverity } : null);
            }
        } catch (e) { console.error(e); }
    };

    if (isLoading) return <div className="min-h-screen pt-24 bg-bg-main flex items-center justify-center text-white">Loading Dashboard...</div>;

    return (
        <div className="h-screen bg-bg-main flex flex-col overflow-hidden">

            <div className="flex-1 flex overflow-hidden max-w-[1600px] w-full mx-auto px-4 md:px-8 pb-4 gap-6">

                <div className="w-1/3 min-w-[350px] flex flex-col bg-bg-card border border-border-main rounded-xl overflow-hidden shadow-lg">
                    <div className="p-4 border-b border-border-main bg-bg-secondary/30 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Siren size={20} className="text-alert-critical" />
                            Active Reports
                        </h2>
                        <span className="bg-bg-main text-text-secondary text-xs px-2 py-1 rounded-full border border-border-main">{incidents.length}</span>
                    </div>
                    <div className="flex-1 no-scrollbar overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {incidents.length === 0 ? (
                            <div className="text-center text-text-muted py-10">No active reports.</div>
                        ) : (
                            incidents.map(incident => (
                                <div
                                    key={incident._id}
                                    className={`relative transition-all duration-200 cursor-pointer rounded-lg border-2 ${selectedIncident?._id === incident._id ? 'border-primary ring-2 ring-primary/20 scale-[1.02]' : 'border-transparent hover:border-border-main'}`}
                                >
                                    <IncidentCard
                                        incident={incident}
                                        onClick={(e, inc) => setSelectedIncident(inc)}
                                        onVote={() => { }}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-6 overflow-hidden">

                    <div className="flex-[2] bg-bg-card border border-border-main rounded-xl overflow-hidden shadow-lg flex flex-col relative">
                        {!selectedIncident ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-text-muted bg-bg-secondary/10">
                                <Search size={48} className="mb-4 opacity-50" />
                                <p className="text-lg">Select a report from the list to view details and assign units.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col h-full">
                                <div className="p-4 border-b border-border-main bg-bg-secondary/30 flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h2 className="text-2xl font-bold text-white">{selectedIncident.type}</h2>
                                            <Badge priority={selectedIncident.severity}>{selectedIncident.severity}</Badge>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-text-secondary">
                                            <span className="flex items-center gap-1"><Clock size={14} /> {new Date(selectedIncident.createdAt).toLocaleString()}</span>
                                            <span className="flex items-center gap-1"><MapPin size={14} /> Lat: {selectedIncident.location.lat.toFixed(4)}, Lng: {selectedIncident.location.lng.toFixed(4)}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className='relative'>
                                        <Button
                                            className="flex gap-1"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => getIdleEmployee()}
                                        >
                                            Assign Report
                                        </Button>
                                        <div className='absolute top-full left-0 mt-2 z-50'>
                                            {showAssignModal && (
                                                <IdleEmployees 
                                                    employees={idleEmployees} 
                                                    handleAssign={(id) => {
                                                        handleAssign(id);
                                                        setShowAssignModal(false);
                                                    }}
                                                    onClose={() => setShowAssignModal(false)}
                                                    onForward={handleForward}
                                                    isForwarding={isForwarding}
                                                />
                                            )}
                                        </div>
                                                
                                        
                                    </div>
                                    <div>
                                        <Button
                                            className="flex gap-1"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleSeverityChange(
                                                selectedIncident.severity === 'low' ? 'medium' :
                                                selectedIncident.severity === 'medium' ? 'high' : 'low'
                                            )}
                                        >
                                            <AlertTriangle size={16} />
                                            <span>Severity: {selectedIncident.severity.charAt(0).toUpperCase() + selectedIncident.severity.slice(1)}</span>
                                        </Button>
                                        
                                    </div>
                                        <select
                                            className="bg-bg-main border border-border-main rounded px-3 py-1.5 text-sm text-white focus:border-primary outline-none cursor-pointer"
                                            value={selectedIncident.status}
                                            onChange={(e) => handleStatusChange(e.target.value as ReportStatus)}
                                        >
                                            <option value="unverified">Unverified</option>
                                            <option value="verified">Verified</option>
                                            <option value="assigning">Assigning</option>
                                            <option value="assigned">Assigned</option>
                                            <option value="resolved">Resolved</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 flex gap-6">
                                    <div className="w-1/2 bg-black/20 rounded-lg overflow-hidden border border-border-main flex items-center justify-center min-h-50">
                                        {selectedIncident.image ? (
                                            <img
                                                src={selectedIncident.image}
                                                style={{ objectFit: "fill" }}
                                                alt="Incident Evidence"
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center text-text-muted">
                                                <ImageIcon size={48} className="mb-2 opacity-50" />
                                                <span>No image evidence provided</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 space-y-4">
                                        <div className="bg-bg-main p-4 rounded-lg border border-border-main">
                                            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">Description</h3>
                                            <p className="text-white text-base leading-relaxed">
                                                {selectedIncident.description || "No description provided."}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-bg-main p-3 rounded-lg border border-border-main text-center">
                                                <div className="text-2xl font-bold text-white mb-1">{selectedIncident.upvotes}</div>
                                                <div className="text-xs text-text-muted">Upvotes</div>
                                            </div>
                                            <div className="bg-bg-main p-3 rounded-lg border border-border-main text-center">
                                                <div className="text-2xl font-bold text-alert-medium mb-1">{selectedIncident.duplicates || 0}</div>
                                                <div className="text-xs text-text-muted">Duplicates</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>


                    {selectedIncident && (
                        <div className="flex-[3] bg-bg-card border border-border-main rounded-xl overflow-hidden shadow-lg flex flex-col min-h-[450px] relative">
                            <div className="absolute top-2 left-2 z-[400] bg-bg-card/90 backdrop-blur px-3 py-1 rounded text-xs font-bold text-text-primary border border-border-main shadow-sm flex items-center gap-2">
                                <MapPin size={12} className="text-alert-critical" /> Incident Location
                                <span className="text-text-muted">---</span>
                                <div className="p-1 bg-primary rounded-full"><div className="bg-white w-1.5 h-1.5 rounded-full"></div></div> Responding Unit
                            </div>

                            <LiveMap
                                center={[selectedIncident.location.lat, selectedIncident.location.lng]}
                                zoom={15}
                                incidents={[selectedIncident]}
                                employees={
                                    (() => {
                                        const assignedEmp = idleEmployees.find(e =>
                                            e._id && selectedIncident.responderId?.includes(e._id)
                                        );
                                        return assignedEmp ? [assignedEmp] : [];
                                    })()
                                }
                                selectedIncident={(() => {
                                    const assignedEmp = idleEmployees.find(e => e._id && selectedIncident.responderId?.includes(e._id));
                                    if (assignedEmp && assignedEmp.location) {
                                        return { ...selectedIncident, employeeLocation: assignedEmp.location };
                                    }
                                    return selectedIncident;
                                })()}
                                className="h-full w-full"
                            />
                        </div>
                    )}

                </div>
            </div>


        </div>
    );
}


