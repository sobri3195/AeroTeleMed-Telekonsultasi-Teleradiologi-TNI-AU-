import { format, formatDistanceToNow } from 'date-fns';
import clsx, { ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string | Date, formatStr: string = 'dd MMM yyyy'): string {
  return format(new Date(date), formatStr);
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'dd MMM yyyy HH:mm');
}

export function formatTimeAgo(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}j ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}d`;
  }
  return `${secs}d`;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    dokter_umum: 'Dokter Umum',
    dokter_spesialis: 'Dokter Spesialis',
    perawat: 'Perawat',
    radiografer: 'Radiografer',
    admin: 'Administrator',
  };
  return labels[role] || role;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    scheduled: 'text-blue-600 bg-blue-50',
    waiting: 'text-yellow-600 bg-yellow-50',
    active: 'text-green-600 bg-green-50',
    completed: 'text-gray-600 bg-gray-50',
    cancelled: 'text-red-600 bg-red-50',
    urgent: 'text-orange-600 bg-orange-50',
    emergency: 'text-red-600 bg-red-50',
    routine: 'text-blue-600 bg-blue-50',
    stable: 'text-green-600 bg-green-50',
    monitoring: 'text-yellow-600 bg-yellow-50',
    critical: 'text-red-600 bg-red-50',
  };
  return colors[status] || 'text-gray-600 bg-gray-50';
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    routine: 'text-blue-600 bg-blue-50',
    urgent: 'text-orange-600 bg-orange-50',
    emergency: 'text-red-600 bg-red-50',
  };
  return colors[priority] || 'text-gray-600 bg-gray-50';
}

export function getAlarmColor(severity: string): string {
  const colors: Record<string, string> = {
    low: 'text-blue-600 bg-blue-50 border-blue-200',
    medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    high: 'text-orange-600 bg-orange-50 border-orange-200',
    critical: 'text-red-600 bg-red-50 border-red-200',
  };
  return colors[severity] || 'text-gray-600 bg-gray-50 border-gray-200';
}

export function validateVital(parameter: string, value: number): {
  status: 'normal' | 'low' | 'high' | 'critical';
  message?: string;
} {
  const thresholds: Record<string, { low: number; high: number; criticalLow: number; criticalHigh: number }> = {
    heartRate: { low: 60, high: 100, criticalLow: 40, criticalHigh: 140 },
    respiratoryRate: { low: 12, high: 20, criticalLow: 8, criticalHigh: 30 },
    spO2: { low: 95, high: 100, criticalLow: 90, criticalHigh: 100 },
    bloodPressureSystolic: { low: 90, high: 140, criticalLow: 70, criticalHigh: 180 },
    bloodPressureDiastolic: { low: 60, high: 90, criticalLow: 40, criticalHigh: 110 },
    temperature: { low: 36.1, high: 37.2, criticalLow: 35.0, criticalHigh: 39.0 },
  };

  const threshold = thresholds[parameter];
  if (!threshold) return { status: 'normal' };

  if (value <= threshold.criticalLow) {
    return { status: 'critical', message: `${parameter} sangat rendah` };
  }
  if (value >= threshold.criticalHigh) {
    return { status: 'critical', message: `${parameter} sangat tinggi` };
  }
  if (value < threshold.low) {
    return { status: 'low', message: `${parameter} rendah` };
  }
  if (value > threshold.high) {
    return { status: 'high', message: `${parameter} tinggi` };
  }
  return { status: 'normal' };
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function downloadFile(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
