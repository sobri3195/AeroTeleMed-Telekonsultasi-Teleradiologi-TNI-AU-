# Quick Start Guide - AeroTeleMed

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- Git

### Step 1: Clone & Install

```bash
# Clone the repository
git clone https://github.com/sobri3195/AeroTeleMed-Telekonsultasi-Teleradiologi-TNI-AU-.git
cd AeroTeleMed-Telekonsultasi-Teleradiologi-TNI-AU-

# Install dependencies
npm install
```

### Step 2: Configure Environment

```bash
# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# VITE_API_BASE_URL=http://localhost:8080/api
```

### Step 3: Run Development Server

```bash
npm run dev
```

Visit: **http://localhost:3000**

### Step 4: Build for Production

```bash
npm run build
```

Output will be in `dist/` directory.

## 📱 First Login

### Demo Credentials (for development)
```
Username: dokter.umum
Password: demo123
OTP: 123456
```

**Note**: These are placeholder credentials. In production, use actual authentication system.

## 🧭 Navigation Guide

After logging in, you'll see the sidebar with:

1. **Dashboard** - Overview & statistics
2. **Telekonsultasi** - Video consultations
3. **Radiologi** - DICOM studies & reports
4. **Tele-ICU** - ICU patient monitoring
5. **Laporan** - Reports & exports
6. **Pengaturan** - User settings

## 🎯 Common Tasks

### Create a Consultation
1. Go to **Telekonsultasi**
2. Click **"Konsultasi Baru"**
3. Fill in patient and consultation details
4. Click **"Mulai"** to start video session

### Upload DICOM Study
1. Go to **Radiologi**
2. Click **"Upload DICOM"**
3. Select DICOM file (.dcm)
4. Click **"Upload"**

### Monitor ICU Patient
1. Go to **Tele-ICU**
2. Select patient from list
3. View real-time vitals
4. Acknowledge/resolve alarms if any

### Write Clinical Note
1. Open active consultation
2. Fill in SOAP format:
   - Subjective (patient complaint)
   - Objective (examination)
   - Assessment (diagnosis)
   - Plan (treatment)
3. Click **"Simpan Catatan"**

## 🔧 Development

### Project Structure
```
src/
├── pages/          # Page components
├── components/     # Reusable components
├── services/       # API services
├── stores/         # State management
├── types/          # TypeScript types
└── utils/          # Helper functions
```

### Adding a New Page
1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation item in `src/components/common/Layout.tsx`

### Adding a New API Service
1. Create service in `src/services/`
2. Use `apiService` base class
3. Define types in `src/types/`

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in vite.config.ts or:
npm run dev -- --port 3001
```

### API Connection Failed
- Check `VITE_API_BASE_URL` in `.env`
- Verify backend server is running
- Check CORS settings on backend

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Lint Errors
```bash
npm run lint
# Fix auto-fixable issues:
npx eslint . --ext ts,tsx --fix
```

## 📚 Next Steps

- Read **README.md** for detailed overview
- Check **API_DOCUMENTATION.md** for API reference
- See **DEPLOYMENT.md** for production deployment
- Review **CONTRIBUTING.md** for contribution guidelines

## 💡 Tips

1. **Hot Module Replacement (HMR)** - Changes reflect instantly in dev mode
2. **TypeScript** - Hover over variables to see types
3. **Tailwind CSS** - Use utility classes for styling
4. **React DevTools** - Install browser extension for debugging
5. **Network Tab** - Monitor API calls in browser DevTools

## 🆘 Need Help?

- **Documentation**: See `/docs` directory
- **Issues**: GitHub Issues
- **Email**: dev-team@aerotelemed.tni.mil.id
- **Internal**: Slack #aerotelemed-dev

## ✅ Checklist for New Developers

- [ ] Node.js 18+ installed
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] Environment configured (`.env`)
- [ ] Development server running (`npm run dev`)
- [ ] Can access http://localhost:3000
- [ ] Can login successfully
- [ ] Explored all main pages
- [ ] Read README.md
- [ ] Read CONTRIBUTING.md

---

**Happy Coding!** 🎉

For detailed information, see the full documentation in README.md and other .md files.
