# Contributing to AeroTeleMed

Terima kasih atas minat Anda untuk berkontribusi pada AeroTeleMed! Dokumen ini memberikan panduan untuk berkontribusi pada proyek.

## Code of Conduct

Proyek ini dan semua peserta diharapkan mematuhi kode etik TNI Angkatan Udara dan standar profesionalisme tertinggi.

## Cara Berkontribusi

### 1. Reporting Bugs

Sebelum membuat bug report, pastikan:
- Bug belum dilaporkan sebelumnya (cek Issues)
- Anda menggunakan versi terbaru
- Anda bisa mereproduksi bug secara konsisten

Format bug report:
```markdown
**Deskripsi Bug**
Deskripsi singkat dan jelas tentang bug.

**Cara Mereproduksi**
1. Langkah 1
2. Langkah 2
3. ...

**Expected Behavior**
Apa yang seharusnya terjadi.

**Actual Behavior**
Apa yang sebenarnya terjadi.

**Screenshots**
Jika applicable, tambahkan screenshot.

**Environment**
- Browser: [Chrome 120, Firefox 121, etc.]
- OS: [Windows 11, Ubuntu 22.04, etc.]
- Version: [1.0.0]

**Additional Context**
Informasi tambahan tentang masalah.
```

### 2. Suggesting Features

Format feature request:
```markdown
**Feature Description**
Deskripsi fitur yang diusulkan.

**Use Case**
Jelaskan use case atau skenario penggunaan.

**Proposed Solution**
Solusi yang Anda usulkan.

**Alternatives Considered**
Alternatif solusi yang sudah dipertimbangkan.

**Additional Context**
Informasi tambahan, mockup, atau referensi.
```

### 3. Pull Requests

#### Setup Development Environment

```bash
# Fork repository
git clone https://github.com/your-username/AeroTeleMed-Telekonsultasi-Teleradiologi-TNI-AU-.git
cd AeroTeleMed-Telekonsultasi-Teleradiologi-TNI-AU-

# Install dependencies
npm install

# Create feature branch
git checkout -b feature/amazing-feature

# Start development server
npm run dev
```

#### Development Workflow

1. **Create a branch**
   ```bash
   git checkout -b feature/feature-name
   # atau
   git checkout -b fix/bug-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Update tests if applicable

3. **Test your changes**
   ```bash
   npm run build
   npm run lint
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

   Commit message format:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc.)
   - `refactor:` - Code refactoring
   - `test:` - Adding or updating tests
   - `chore:` - Maintenance tasks

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Create Pull Request**
   - Provide clear description
   - Reference related issues
   - Include screenshots if UI changes
   - Wait for code review

## Coding Standards

### TypeScript

```typescript
// ✅ Good
interface UserProps {
  name: string;
  email: string;
  role: UserRole;
}

function getUser(id: string): Promise<User> {
  return apiService.get<User>(`/users/${id}`);
}

// ❌ Bad
function getUser(id) {
  return apiService.get('/users/' + id);
}
```

### React Components

```typescript
// ✅ Good - Functional component with TypeScript
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

// ❌ Bad - No types
export function Button({ label, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
```

### File Organization

```
src/
├── components/
│   ├── common/          # Shared components
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   └── consultation/    # Feature-specific components
│       └── VideoPanel.tsx
├── pages/               # Page components
│   └── Dashboard.tsx
├── services/            # API services
│   └── api.ts
├── stores/              # State management
│   └── authStore.ts
├── types/               # TypeScript types
│   └── index.ts
└── utils/               # Utility functions
    └── helpers.ts
```

### Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Functions**: camelCase (`getUserData()`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Interfaces**: PascalCase with `I` prefix optional (`User` or `IUser`)
- **Types**: PascalCase (`UserRole`)

### Code Style

- Use functional components with hooks
- Prefer `const` over `let`
- Use arrow functions for callbacks
- Destructure props
- Use TypeScript for all new code
- Add JSDoc comments for complex functions

```typescript
/**
 * Formats a date string into a human-readable format
 * @param date - ISO date string or Date object
 * @param format - Date format string (default: 'dd MMM yyyy')
 * @returns Formatted date string
 */
export function formatDate(date: string | Date, format: string = 'dd MMM yyyy'): string {
  return format(new Date(date), format);
}
```

## Testing

### Unit Tests (Coming Soon)

```typescript
// Example test structure
describe('formatDate', () => {
  it('should format ISO date correctly', () => {
    const result = formatDate('2024-01-15');
    expect(result).toBe('15 Jan 2024');
  });
  
  it('should handle Date objects', () => {
    const date = new Date('2024-01-15');
    const result = formatDate(date);
    expect(result).toBe('15 Jan 2024');
  });
});
```

## Documentation

- Update README.md if adding new features
- Update API_DOCUMENTATION.md if changing API
- Add JSDoc comments for public functions
- Include code examples where helpful

## Review Process

1. **Automated Checks**
   - TypeScript compilation
   - ESLint
   - Build process

2. **Code Review**
   - At least one approval required
   - Address all review comments
   - Keep discussions constructive

3. **Testing**
   - Manual testing by reviewer
   - Verify no regressions

4. **Merge**
   - Squash and merge preferred
   - Delete branch after merge

## Security

- **Never commit sensitive data** (API keys, passwords, tokens)
- Use environment variables for configuration
- Follow OWASP security guidelines
- Report security vulnerabilities privately to security@aerotelemed.tni.mil.id

## Questions?

Jika ada pertanyaan tentang contributing:
- Buka Issue dengan label `question`
- Email: dev-team@aerotelemed.tni.mil.id
- Slack: #aerotelemed-dev (internal)

---

**Thank you for contributing to AeroTeleMed!** 🚀
