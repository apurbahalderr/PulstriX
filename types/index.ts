export type UserRole = 'user' | 'responder' | 'employee';

export type ReportType =
  | 'Crime'
  | 'Medical'
  | 'Disaster'
  | 'Infrastructure Collapse'
  | 'Accident'
  | 'Other'
  | 'Fire'
  | 'Emergency';

export type ReportSeverity = 'high' | 'medium' | 'low';

export type ReportStatus = 'resolved' | 'verified' | 'unverified' | 'assigning' | 'assigned';

export type Department = 
  | "Fire Department"
  | "Traffic Police"
  | "Health Department"
  | "Police Department"
  | "Disaster Management"
  | "Public Works Department"
  | "General"
  | "Emergency Response";

export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone: number;
  sessionId?: string;
  role: UserRole;
  department?: Department | string;
  location?: { lat: number, lng: number };
  address?: string;
  employees?: string[];
  responder?: string;
  reportIdAssigned?: string;
  status?: 'idle' | 'busy';
}

export interface Report {
  _id: string;
  sessionId: string;
  userId?: string;
  type: ReportType | string;
  location: {
    lat: number;
    lng: number;
  };
  employeeLocation?: {
    lat: number;
    lng: number;
  };
  employeeId?: string[];
  responderId?: string[];
  responderNotes?: string;
  description: string;
  phone?: number;
  image?: string;
  upvotes: number;
  downvotes: number;
  duplicates: number;
  severity: ReportSeverity;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MapPin {
  id: string;
  lat: number;
  lng: number;
  type: ReportSeverity | 'verified';
}
