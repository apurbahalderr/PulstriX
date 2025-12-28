import { IncidentPriority, IncidentStatus, PinType } from '@/types';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'outline' | 'solid';
    status?: IncidentStatus;
    priority?: IncidentPriority;
    pinType?: PinType;
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

    // Determine color based on props precedence
    if (priority === 'Critical' || pinType === 'critical') {
        colorClass = 'bg-alert-critical/20 text-alert-critical border-alert-critical/30';
    } else if (priority === 'High') {
        colorClass = 'bg-alert-high/20 text-alert-high border-alert-high/30';
    } else if (priority === 'Medium') {
        colorClass = 'bg-alert-medium/20 text-alert-medium border-alert-medium/30';
    } else if (priority === 'Low') {
        colorClass = 'bg-alert-low/20 text-alert-low border-alert-low/30'; // Note: Low corresponds to correct green/success color in theme? Green is verified/resolved. Low is usually green too.
        // Theme says: low: #22C55E (Green)
    }

    if (status === 'Resolved' || pinType === 'resolved') {
        colorClass = 'bg-status-resolved/20 text-status-resolved border-status-resolved/30';
    } else if (status === 'Assigned') {
        colorClass = 'bg-status-assigned/20 text-status-assigned border-status-assigned/30';
    } else if (status === 'Verified' || pinType === 'verified') {
        colorClass = 'bg-info/20 text-info border-info/30'; // Verified is blue
    } else if (pinType === 'unverified') {
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
