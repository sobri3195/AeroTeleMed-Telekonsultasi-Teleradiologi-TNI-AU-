# API Documentation - AeroTeleMed

## Base URL
```
http://localhost:8080/api
```

## Authentication

All API endpoints (except login) require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Authentication Endpoints

### Login
```
POST /auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string",
  "otp": "string"
}

Response:
{
  "access_token": "string",
  "refresh_token": "string",
  "user": {
    "id": "string",
    "username": "string",
    "name": "string",
    "role": "dokter_umum|dokter_spesialis|perawat|radiografer|admin",
    "facility": "string",
    "email": "string",
    "phone": "string"
  },
  "expires_in": 3600
}
```

### Logout
```
POST /auth/logout
Authorization: Bearer <token>
```

### Refresh Token
```
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "string"
}
```

### Get Current User
```
GET /auth/me
Authorization: Bearer <token>
```

## Dashboard Endpoints

### Get Dashboard Statistics
```
GET /dashboard/stats
Authorization: Bearer <token>

Response:
{
  "activeConsultations": 5,
  "pendingConsultations": 12,
  "completedToday": 8,
  "pendingRadiologyReviews": 15,
  "icuPatientsMonitored": 6,
  "criticalAlarms": 2,
  "averageResponseTime": 45,
  "systemUptime": 99.5
}
```

## Consultation Endpoints

### Get All Consultations
```
GET /consultations?status={status}
Authorization: Bearer <token>

Query Parameters:
- status (optional): scheduled|waiting|active|completed|cancelled

Response: Array of Consultation objects
```

### Get Consultation by ID
```
GET /consultations/:id
Authorization: Bearer <token>

Response: Consultation object
```

### Create Consultation
```
POST /consultations
Authorization: Bearer <token>
Content-Type: application/json

{
  "patientId": "string",
  "consultantDoctorId": "string",
  "type": "video|audio|chat",
  "priority": "routine|urgent|emergency",
  "scheduledAt": "ISO8601 datetime"
}

Response: Consultation object
```

### Start Consultation
```
POST /consultations/:id/start
Authorization: Bearer <token>

Response: Consultation object with updated status
```

### End Consultation
```
POST /consultations/:id/end
Authorization: Bearer <token>

Response: Consultation object with updated status
```

### Save Clinical Note
```
POST /consultations/:id/clinical-note
Authorization: Bearer <token>
Content-Type: application/json

{
  "subjective": "string",
  "objective": "string",
  "assessment": "string",
  "plan": "string",
  "diagnosis": "string",
  "prescription": "string"
}

Response: Consultation object with clinical note
```

### Get Chat Messages
```
GET /consultations/:id/messages
Authorization: Bearer <token>

Response: Array of ChatMessage objects
```

### Send Message
```
POST /consultations/:id/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "string"
}

Response: ChatMessage object
```

### Upload Attachment
```
POST /consultations/:id/attachments
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: File

Response: Attachment object
```

### Get Patient RME (FHIR)
```
GET /fhir/Patient/:patientId
Authorization: Bearer <token>

Response: FHIR Patient resource
```

## Radiology Endpoints

### Get All Studies
```
GET /radiology/studies?status={status}
Authorization: Bearer <token>

Query Parameters:
- status (optional): uploaded|pending_review|in_review|reported|finalized

Response: Array of DicomStudy objects
```

### Get Study by ID
```
GET /radiology/studies/:id
Authorization: Bearer <token>

Response: DicomStudy object
```

### Upload DICOM
```
POST /dicom/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: DICOM file
metadata: JSON string with study metadata

Response: DicomStudy object
```

### Get DICOM Viewer URL
```
GET /dicom/viewer-url/:studyId
Authorization: Bearer <token>

Response:
{
  "url": "string"
}
```

### Create Radiology Report
```
POST /radiology/studies/:studyId/report
Authorization: Bearer <token>
Content-Type: application/json

{
  "findings": "string",
  "impression": "string",
  "recommendations": "string",
  "annotations": [
    {
      "type": "circle|arrow|rectangle|text",
      "coordinates": [x, y, width, height],
      "label": "string"
    }
  ]
}

Response: RadiologyReport object
```

### Finalize Report
```
POST /radiology/studies/:studyId/report/:reportId/finalize
Authorization: Bearer <token>

Response: RadiologyReport object with finalized status
```

### Request AI Triage
```
POST /ai/triage
Authorization: Bearer <token>
Content-Type: application/json

{
  "study_id": "string"
}

Response:
{
  "confidence": 0.95,
  "findings": ["Possible pneumonia", "Cardiomegaly"],
  "severity": "high",
  "recommendations": ["Review by radiologist"],
  "processedAt": "ISO8601 datetime"
}
```

### Compare Studies
```
GET /dicom/compare?study1={id1}&study2={id2}
Authorization: Bearer <token>

Response:
{
  "url": "string"
}
```

## Tele-ICU Endpoints

### Get All ICU Patients
```
GET /teleicu/patients
Authorization: Bearer <token>

Response: Array of ICUPatient objects
```

### Get ICU Patient by ID
```
GET /teleicu/patients/:id
Authorization: Bearer <token>

Response: ICUPatient object
```

### Get Vitals Stream
```
GET /teleicu/stream/:patientId
Authorization: Bearer <token>

Response: Real-time vitals data (WebSocket or SSE)
```

### Get Vitals History
```
GET /teleicu/patients/:patientId/vitals/history?hours={hours}
Authorization: Bearer <token>

Query Parameters:
- hours (optional, default: 24): Number of hours to retrieve

Response: Array of VitalSignsHistory objects
```

### Get Alarms
```
GET /teleicu/alarms?patient_id={patientId}
Authorization: Bearer <token>

Query Parameters:
- patient_id (optional): Filter by patient

Response: Array of Alarm objects
```

### Acknowledge Alarm
```
POST /teleicu/alarms/:alarmId/acknowledge
Authorization: Bearer <token>

Response: Alarm object with acknowledgment info
```

### Resolve Alarm
```
POST /teleicu/alarms/:alarmId/resolve
Authorization: Bearer <token>

Response: Alarm object with resolved status
```

### Capture Snapshot
```
POST /teleicu/patients/:patientId/snapshot
Authorization: Bearer <token>

Response: Array of last 10 seconds of vitals data
```

### Record Intervention
```
POST /teleicu/patients/:patientId/interventions
Authorization: Bearer <token>
Content-Type: application/json

{
  "intervention": "string"
}
```

## Data Models

### Consultation
```typescript
{
  id: string;
  patientId: string;
  patient: Patient;
  requestingDoctor: User;
  consultantDoctor?: User;
  status: "scheduled" | "waiting" | "active" | "completed" | "cancelled";
  type: "video" | "audio" | "chat";
  priority: "routine" | "urgent" | "emergency";
  scheduledAt?: string;
  startedAt?: string;
  endedAt?: string;
  clinicalNote?: ClinicalNote;
  attachments: Attachment[];
  chatMessages: ChatMessage[];
  sessionId?: string;
  metadata: ConsultationMetadata;
}
```

### DicomStudy
```typescript
{
  id: string;
  studyInstanceUID: string;
  patientId: string;
  patient: Patient;
  modality: "XR" | "CT" | "MRI" | "US" | "CR" | "DX";
  studyDate: string;
  studyDescription: string;
  seriesCount: number;
  instanceCount: number;
  status: "uploaded" | "pending_review" | "in_review" | "reported" | "finalized";
  uploadedBy: string;
  uploadedAt: string;
  radiologistId?: string;
  radiologist?: User;
  report?: RadiologyReport;
  aiTriageResult?: AITriageResult;
  viewerUrl?: string;
}
```

### ICUPatient
```typescript
{
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
  status: "stable" | "monitoring" | "critical";
  ventilatorSettings?: VentilatorSettings;
  lastUpdated: string;
}
```

### VitalSigns
```typescript
{
  heartRate: number;
  respiratoryRate: number;
  spO2: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  temperature: number;
  timestamp: string;
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid input data",
  "details": []
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## OAuth2.0 Scopes

The following scopes are used for access control:

- `telemed.read` - Read consultation data
- `telemed.write` - Create/modify consultations
- `radiology.read` - Read radiology studies
- `radiology.write` - Upload studies and create reports
- `teleicu.read` - Read ICU patient data
- `teleicu.write` - Acknowledge alarms and record interventions
- `admin.read` - Read admin data
- `admin.write` - Manage users and system settings
- `audit.read` - Read audit logs

## Rate Limiting

API requests are rate-limited to prevent abuse:

- General endpoints: 100 requests per minute
- File upload endpoints: 10 requests per minute
- Real-time streaming endpoints: No limit (connection-based)

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

## WebSocket Endpoints

### Real-time Vitals Stream
```
ws://localhost:8080/ws/teleicu/stream/:patientId
Authorization: Bearer <token>

Messages:
{
  "type": "vitals_update",
  "data": VitalSigns
}

{
  "type": "alarm",
  "data": Alarm
}
```

### Consultation Chat
```
ws://localhost:8080/ws/consultations/:id/chat
Authorization: Bearer <token>

Messages:
{
  "type": "message",
  "data": ChatMessage
}

{
  "type": "user_joined",
  "data": { "userId": "string", "userName": "string" }
}

{
  "type": "user_left",
  "data": { "userId": "string" }
}
```
