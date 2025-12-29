import React from 'react';
import { User } from '@/types';
import { Button } from '@/components/ui/Button';
import { ArrowRight, MapPin, X } from 'lucide-react';

interface IdleEmployeesProps {
    employees: User[];
    handleAssign: (employeeId: string) => void;
    onClose?: () => void;
    onForward?: () => void;
    isForwarding?: boolean;
}

const IdleEmployees = ({ employees, handleAssign, onClose, onForward, isForwarding }: IdleEmployeesProps) => {
    

    return (
        <div className='w-80 bg-bg-card border border-border-main rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[400px] z-50'>
            <div className="p-3 border-b border-border-main bg-bg-secondary/50 flex justify-between items-center">
                <h3 className="font-semibold text-white text-sm">Available Units ({employees.length})</h3>
                {onClose && (
                    <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
                        <X size={16} />
                    </button>
                )}
            </div>

            <div className="overflow-y-auto p-2 space-y-2 no-scrollbar">
                {employees.length === 0 ? (
                    <div className="text-center text-text-muted py-4 text-sm">
                        <p className="mb-3">No idle units found.</p>
                        {onForward && (
                            <Button 
                                onClick={onForward} 
                                disabled={isForwarding}
                                className="w-full"
                                variant="outline"
                                size="sm"
                            >
                                {isForwarding ? 'Forwarding...' : 'Forward to Nearby Responder'}
                            </Button>
                        )}
                    </div>
                ) : (
                    employees.map((emp) => (
                        <div key={emp._id} className="bg-bg-main p-3 rounded-lg border border-border-main hover:border-primary/30 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="font-medium text-white text-sm">{emp.name}</div>
                                    <div className="text-xs text-text-muted">{emp.email}</div>
                                </div>
                                <div className="h-2 w-2 rounded-full bg-status-active shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-text-secondary mb-3">
                                <MapPin size={12} />
                                <span>{emp.location ? 'Nearby' : 'Location unknown'}</span>
                            </div>

                            <Button
                                size="sm"
                                className="w-full h-8 text-xs"
                                variant="primary"
                                leftIcon={<ArrowRight size={12} />}
                                onClick={() => emp._id && handleAssign(emp._id)}
                            >
                                Assign
                            </Button>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default IdleEmployees;

