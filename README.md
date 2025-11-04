# AeroTeleMed - Sistem Telemedicine & Teleradiologi TNI AU

AeroTeleMed adalah aplikasi web berbasis React yang memfasilitasi telekonsultasi dokter-pasien, teleradiologi antar fasilitas, serta tele-ICU monitoring untuk TNI Angkatan Udara.

## 🚀 Fitur Utama

### 1. Telekonsultasi
- **Video call real-time** menggunakan WebRTC/Jitsi/Twilio
- **Chat teks** dengan kemampuan upload file
- **Share RME** pasien melalui FHIR API
- **Clinical Note (SOAP)** - Subjective, Objective, Assessment, Plan
- **Session audit log** lengkap
- **Bandwidth adaptif** dengan fallback audio/chat

### 2. Teleradiologi
- **Upload & view DICOM** (XR, CT, MRI, USG)
- **Integrasi PACS** (DICOM C-STORE, WADO-RS)
- **AI triage** untuk deteksi awal kelainan
- **Laporan radiologi** dengan markup/annotation
- **History viewer** untuk komparasi hasil
- **Export ke RME** melalui FHIR DiagnosticReport

### 3. Tele-ICU
- **Dashboard monitoring** pasien ICU dari berbagai RS/Lanud
- **Data vitals real-time**: HR, RR, SpO₂, BP, Temperature
- **Grafik tren 24 jam** dengan alarm otomatis
- **Notifikasi push** ke dokter jaga
- **Ventilator settings monitoring**
- **Audit trail** semua tindakan

### 4. Administrasi & Audit
- **Manajemen user** dengan role-based access control
- **Jadwal konsultasi** dan prioritas antrian
- **Audit log** lengkap
- **Statistik** dan reporting
- **Monitoring system health**

## 🛠️ Teknologi

- **Frontend**: React 18 + TypeScript
- **Routing**: React Router v6
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Build Tool**: Vite

## 📋 Prasyarat

- Node.js >= 18.x
- npm atau yarn

## 🔧 Instalasi

```bash
# Clone repository
git clone https://github.com/sobri3195/AeroTeleMed-Telekonsultasi-Teleradiologi-TNI-AU-.git
cd AeroTeleMed-Telekonsultasi-Teleradiologi-TNI-AU-

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env sesuai konfigurasi API backend
# VITE_API_BASE_URL=http://localhost:8080/api

# Run development server
npm run dev
```

## 🚀 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🔐 Keamanan

- **Autentikasi**: SSO dengan 2FA (OTP)
- **Authorization**: OAuth2.0 + JWT dengan scope-based access
- **Enkripsi**: AES-256 at-rest, DTLS-SRTP untuk video
- **Audit Trail**: Immutable log semua aktivitas
- **Session Management**: Auto-timeout setelah idle
- **Consent Management**: Persetujuan sebelum sesi

## 📱 User Roles

1. **Dokter Umum Lanud**: Konsultasi ke spesialis, upload pemeriksaan
2. **Dokter Spesialis Konsultan**: Terima rujukan, video call, clinical note
3. **Perawat/ICU Staff**: Kirim data vital, monitor dashboard
4. **Radiografer**: Upload citra DICOM, laporan
5. **Admin Sistem**: Kelola user, jadwal, audit log

## 🔌 API Integration

### FHIR API (RME/SIMRS)
- `GET /Patient/:id` - Data pasien
- `GET /Observation?vital-signs` - Data vital signs
- `POST /DiagnosticReport` - Laporan diagnostik
- `POST /Encounter/teleconsultation` - Record konsultasi

### PACS API (DICOM)
- `POST /dicom/upload` - Upload studi
- `GET /dicom/study/:id` - Detail studi
- `GET /dicom/viewer-url` - URL viewer

### Video API
- `POST /session/create` - Buat sesi video
- `POST /session/end` - Akhiri sesi
- `GET /session/participants` - Daftar partisipan

### AI Triage API
- `POST /ai/triage` - Deteksi awal (pneumonia, fracture, dll)

### Telemetry API (Tele-ICU)
- `GET /teleicu/stream/:patientId` - Stream data vital
- `POST /teleicu/alert/acknowledge` - Acknowledge alarm

## 📊 Performance Requirements

- Koneksi stabil di bandwidth minimum 512 kbps
- Waktu join session < 10 detik
- Latensi video < 200 ms (LAN), < 400 ms (WAN)
- Uptime > 99%
- Error rate < 1%

## 🧪 Testing

```bash
# Run tests (to be implemented)
npm run test

# Run e2e tests (to be implemented)
npm run test:e2e
```

## 📝 Struktur Folder

```
src/
├── assets/          # Static assets
├── components/      # React components
│   ├── common/      # Shared components
│   ├── consultation/ # Consultation-specific
│   ├── radiology/   # Radiology-specific
│   ├── teleicu/     # Tele-ICU specific
│   └── admin/       # Admin components
├── hooks/           # Custom React hooks
├── pages/           # Page components
├── services/        # API services
├── stores/          # Zustand stores
├── types/           # TypeScript types
├── utils/           # Utility functions
├── App.tsx          # Main App component
└── main.tsx         # Entry point
```

## 🤝 Contributing

Untuk berkontribusi pada proyek ini:

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

Project ini adalah milik TNI Angkatan Udara.

## 📞 Support

Untuk dukungan teknis dan pertanyaan:
- Email: support@aerotelemed.tni.mil.id
- Helpdesk: (021) xxx-xxxx

## 🎯 Roadmap

- [x] Setup project structure
- [x] Implement authentication
- [x] Dashboard & statistics
- [x] Telekonsultasi module
- [x] Teleradiologi module
- [x] Tele-ICU monitoring
- [ ] WebRTC integration
- [ ] DICOM viewer integration
- [ ] Mobile app (React Native)
- [ ] Offline mode
- [ ] Advanced analytics

---

**Developed for TNI Angkatan Udara** 🇮🇩
