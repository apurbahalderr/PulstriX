import { ReportSeverity, ReportStatus, MapPin } from '@/types';






interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'outline' | 'solid';
    status?: ReportStatus;
    priority?: ReportSeverity;
    pinType?: string; 
    className?: string;
}

export function Badge({
    children,
    variant = 'solid',
    status,
    priority,
    pinType,
    className = ''
}: BadgeProps) {
    let colorClass = 'bg-bg-secondary text-text-secondary';
    let borderClass = 'border-border-main';

    
    if (priority === 'high') {
        colorClass = 'bg-alert-high/20 text-alert-high border-alert-high/30';
    } else if (priority === 'medium') {
        colorClass = 'bg-alert-medium/20 text-alert-medium border-alert-medium/30';
    } else if (priority === 'low') {
        colorClass = 'bg-alert-low/20 text-alert-low border-alert-low/30';
    }

    if (status === 'resolved' || pinType === 'resolved') {
        colorClass = 'bg-status-resolved/20 text-status-resolved border-status-resolved/30';
    } else if (status === 'assigned' || status === 'assigning') {
        colorClass = 'bg-status-assigned/20 text-status-assigned border-status-assigned/30';
    } else if (status === 'verified' || pinType === 'verified') {
        colorClass = 'bg-info/20 text-info border-info/30';
    } else if (status === 'unverified' || pinType === 'unverified') {
        colorClass = 'bg-text-secondary/20 text-text-secondary border-text-secondary/30';
    }

    const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    const variantStyles = variant === 'outline' ? `border ${borderClass} bg-transparent` : colorClass;

    return (
        <span className={`${baseStyles} ${variantStyles} ${className}`}>
            {children}
        </span>
    );
}
