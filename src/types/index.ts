export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  facility: string;
  specialization?: string;
  email: string;
  phone: string;
  avatar?: string;
}

export type UserRole = 
  | 'dokter_umum'
  | 'dokter_spesialis'
  | 'perawat'
  | 'radiografer'
  | 'admin';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string, otp: string) => Promise<void>;
  logout: () => void;
}

export interface Patient {
  id: string;
  name: string;
  rank?: string;
  nrp?: string;
  dob: string;
  gender: 'male' | 'female';
  bloodType?: string;
  allergies?: string[];
  facility: string;
  phone?: string;
  emergencyContact?: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  patient: Patient;
  requestingDoctor: User;
  consultantDoctor?: User;
  status: ConsultationStatus;
  type: 'video' | 'audio' | 'chat';
  priority: 'routine' | 'urgent' | 'emergency';
  scheduledAt?: string;
  startedAt?: string;
  endedAt?: string;
  clinicalNote?: ClinicalNote;
  attachments: Attachment[];
  chatMessages: ChatMessage[];
  sessionId?: string;
  metadata: ConsultationMetadata;
}

export type ConsultationStatus = 
  | 'scheduled'
  | 'waiting'
  | 'active'
  | 'completed'
  | 'cancelled';

export interface ClinicalNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  diagnosis?: string;
  prescription?: string;
  followUp?: string;
  createdAt: string;
  createdBy: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  type: 'text' | 'file' | 'system';
  attachmentId?: string;
}

export interface ConsultationMetadata {
  duration?: number;
  bandwidth?: string;
  quality?: string;
  participants: string[];
  auditLog: AuditEntry[];
}

export interface DicomStudy {
  id: string;
  studyInstanceUID: string;
  patientId: string;
  patient: Patient;
  modality: Modality;
  studyDate: string;
  studyDescription: string;
  seriesCount: number;
  instanceCount: number;
  status: StudyStatus;
  uploadedBy: string;
  uploadedAt: string;
  radiologistId?: string;
  radiologist?: User;
  report?: RadiologyReport;
  aiTriageResult?: AITriageResult;
  viewerUrl?: string;
}

export type Modality = 'XR' | 'CT' | 'MRI' | 'US' | 'CR' | 'DX';

export type StudyStatus = 
  | 'uploaded'
  | 'pending_review'
  | 'in_review'
  | 'reported'
  | 'finalized';

export interface RadiologyReport {
  id: string;
  studyId: string;
  findings: string;
  impression: string;
  recommendations: string;
  annotations?: Annotation[];
  createdAt: string;
  createdBy: string;
  finalizedAt?: string;
}

export interface Annotation {
  id: string;
  type: 'circle' | 'arrow' | 'rectangle' | 'text';
  coordinates: number[];
  label?: string;
  seriesNumber?: number;
  instanceNumber?: number;
}

export interface AITriageResult {
  confidence: number;
  findings: string[];
  severity: 'normal' | 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
  processedAt: string;
}

export interface ICUPatient {
  id: string;
  patient: Patient;
  bedNumber: string;
  facility: string;
  admissionDate: string;
  diagnosis: string;
  attendingDoctor: User;
  vitals: VitalSigns;
  vitalsHistory: VitalSignsHistory[];
  alarms: Alarm[];
  status: 'stable' | 'monitoring' | 'critical';
  ventilatorSettings?: VentilatorSettings;
  lastUpdated: string;
}

export interface VitalSigns {
  heartRate: number;
  respiratoryRate: number;
  spO2: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  temperature: number;
  timestamp: string;
}

export interface VitalSignsHistory {
  timestamp: string;
  vitals: Omit<VitalSigns, 'timestamp'>;
}

export interface Alarm {
  id: string;
  patientId: string;
  type: AlarmType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  parameter?: string;
  value?: number;
  threshold?: number;
  timestamp: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolved?: boolean;
}

export type AlarmType = 
  | 'vital_high'
  | 'vital_low'
  | 'vital_critical'
  | 'equipment'
  | 'system';

export interface VentilatorSettings {
  mode: string;
  tidalVolume: number;
  respiratoryRate: number;
  peep: number;
  fiO2: number;
  pressure: number;
}

export interface AuditEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  details?: string;
  ipAddress?: string;
  timestamp: string;
}

export interface DashboardStats {
  activeConsultations: number;
  pendingConsultations: number;
  completedToday: number;
  pendingRadiologyReviews: number;
  icuPatientsMonitored: number;
  criticalAlarms: number;
  averageResponseTime: number;
  systemUptime: number;
}

export interface SystemSettings {
  videoQuality: 'low' | 'medium' | 'high' | 'auto';
  audioEnabled: boolean;
  autoRecordSessions: boolean;
  sessionTimeout: number;
  notificationsEnabled: boolean;
  theme: 'light' | 'dark';
}

export interface VideoSession {
  id: string;
  consultationId: string;
  roomUrl: string;
  participants: string[];
  startedAt: string;
  endedAt?: string;
  quality?: string;
  bandwidth?: string;
  latency?: number;
}

export interface Schedule {
  id: string;
  doctorId: string;
  doctor: User;
  date: string;
  startTime: string;
  endTime: string;
  status: 'available' | 'occupied' | 'break';
  consultationId?: string;
}
