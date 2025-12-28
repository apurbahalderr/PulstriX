import { Report } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ThumbsUp, MapPin, Clock, ThumbsDown } from 'lucide-react';

interface IncidentCardProps {
  incident: Report;
  onClick: (e: React.MouseEvent, incident: Report) => void;
  onVote: (e: React.MouseEvent, id: string, action: 'upvote' | 'downvote') => void;
}

export function IncidentCard({ incident, onClick, onVote }: IncidentCardProps) {
  return (
    <Card
      className="p-4 bg-bg-card hover:bg-bg-secondary transition-colors border-border-main cursor-pointer group mb-2"
      onClick={(e) => onClick(e, incident)}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex gap-2 items-center">
          <Badge priority={incident.severity}>{incident.type}</Badge>
          {incident.image && <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">Img</span>}
        </div>
        <span className="text-xs text-text-muted flex items-center">
          <Clock size={12} className="mr-1" />
          {new Date(incident.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      <p className="text-sm text-text-primary mb-3 line-clamp-2">
        {incident.description}
      </p>

      <div className="flex items-center justify-between mt-4 border-t border-border-main pt-3">
        <div className="flex items-center text-xs text-text-secondary">
          <MapPin size={12} className="mr-1" />
          <span className="truncate max-w-[100px]">
            {incident.location.lat.toFixed(4)}, {incident.location.lng.toFixed(4)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={(e) => onVote(e, incident._id, 'upvote')}
            className="flex items-center space-x-1 text-xs font-medium text-text-secondary hover:text-primary transition-colors"
          >
            <ThumbsUp size={14} className={incident.upvotes > 0 ? "fill-primary/20 text-primary" : ""} />
            <span>{incident.upvotes}</span>
          </button>

          <button
            onClick={(e) => onVote(e, incident._id, 'downvote')}
            className="flex items-center space-x-1 text-xs font-medium text-text-secondary hover:text-alert-critical transition-colors"
          >
            <ThumbsDown size={14} className={incident.downvotes > 0 ? "fill-alert-critical/20 text-alert-critical" : ""} />
            <span>{incident.downvotes}</span>
          </button>
        </div>
      </div>
    </Card>
  );
}
