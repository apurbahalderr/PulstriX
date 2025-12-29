import { Report } from '@/types';
import { X, ThumbsUp, ThumbsDown, MapPin, Clock, ImageIcon, Target } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

interface IncidentDetailsModalProps {
  incident: Report;
  onClose: () => void;
  onVote: (e: React.MouseEvent, id: string, action: 'upvote' | 'downvote') => void;
  onLocationClick?: () => void;
  position?: { top: number; left: number; width?: number };
}

export function IncidentDetailsModal({ incident, onClose, onVote, onLocationClick, position }: IncidentDetailsModalProps) {
  const pathname = usePathname();
  const isDashboard = pathname?.includes('dashboard');

  
  const style = position ? {
    position: 'fixed' as const,
    bottom: "20px",
    right: "5px",
    zIndex: 50,
    marginTop: 0,
    width: "400px",
    maxHeight: "70vh"
  } : undefined;

  const content = (
    <div
      className={`bg-bg-card rounded-2xl border border-border-main shadow-2xl overflow-hidden flex flex-col ${!position ? 'w-full max-w-2xl max-h-[90vh]' : ''}`}
      style={style}
      onClick={e => e.stopPropagation()}
    >
      {}
      <div className="p-4 border-b border-border-main flex justify-between items-start bg-bg-secondary">
        <div>
          <div className="flex gap-2 items-center mb-1">
            <Badge priority={incident.severity}>{incident.type}</Badge>
            <Badge variant="outline" status={incident.status}>{incident.status}</Badge>
            {isDashboard && onLocationClick && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLocationClick();
                }}
                className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full hover:bg-primary/20 transition-colors flex items-center gap-1"
                title="Pin Location on Map"
              >
                <MapPin size={10} />
                Pin
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Clock size={12} />
            {new Date(incident.createdAt).toLocaleString()}
          </div>
        </div>
        <button onClick={onClose} className="text-text-muted hover:text-text-primary p-1 hover:bg-bg-main rounded-full transition-colors">
          <X size={24} />
        </button>
      </div>

      {}
      <div className="overflow-y-auto p-6 space-y-6 no-scrollbar">
        {}
        <div>
          <h3 className="text-sm font-semibold text-text-secondary mb-2 uppercase tracking-wider">Description</h3>
          <p className="text-text-primary leading-relaxed text-lg">
            {incident.description}
          </p>
        </div>

        {}
        {}
        <div className="flex flex-wrap gap-2">
          <Badge priority={incident.severity} className="flex items-center gap-1">
            AI Score: {incident.severity === 'high' ? 'High' : incident.severity === 'medium' ? 'Med' : 'Low'}
          </Badge>
          <div className="flex gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-bg-secondary border border-border-main text-xs text-primary font-medium">
              <ThumbsUp size={12} /> {incident.upvotes} Verify
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-bg-secondary border border-border-main text-xs text-alert-critical font-medium">
              <ThumbsDown size={12} /> {incident.downvotes} False
            </span>
            {incident.duplicates > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-bg-secondary border border-border-main text-xs text-text-secondary font-medium">
                <span className="font-bold">{incident.duplicates}</span> Duplicates
              </span>
            )}
          </div>
        </div>

        {}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Evidence</h3>
            <div className="flex items-center gap-2">
              <div className="text-xs text-text-muted">
                {incident.location.lat.toFixed(6)}, {incident.location.lng.toFixed(6)}
              </div>
              {isDashboard && onLocationClick && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLocationClick();
                  }}
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <Target size={12} />
                  Focus on Map
                </button>
              )}
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-border-main bg-bg-secondary flex items-center justify-center min-h-[200px]">
            {incident.image ? (
              
              
              
              
              
              <img
                src={incident.image}
                alt="Incident Evidence"
                className="w-full h-auto max-h-[400px] object-cover"
              />
            ) : (
              <div className="flex flex-col items-center py-10 text-text-muted">
                <ImageIcon size={48} className="mb-2 opacity-50" />
                <span className="text-sm">No image available</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {}
      <div className="p-4 border-t border-border-main bg-bg-secondary flex gap-3">
        <Button
          onClick={(e) => onVote(e, incident._id, 'upvote')}
          variant="outline"
          className="flex-1 border-primary/20 text-primary hover:bg-primary/10"
          leftIcon={<ThumbsUp size={18} />}
        >
          Verify
        </Button>
        <Button
          onClick={(e) => onVote(e, incident._id, 'downvote')}
          variant="outline"
          className="flex-1 border-alert-critical/20 text-alert-critical hover:bg-alert-critical/10"
          leftIcon={<ThumbsDown size={18} />}
        >
          False
        </Button>
      </div>
    </div>
  );

  if (position) {
    return (
      <div className="fixed inset-0 z-50 pointer-events-none" onClick={onClose}>
        {}
        <div className="pointer-events-auto contents">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      {content}
    </div>
  );
}
