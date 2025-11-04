import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Video, Image, Activity, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Layout } from '../components/common/Layout';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { DashboardStats } from '../types';
import { apiService } from '../services/api';
import { useAuthStore } from '../stores/authStore';

export function Dashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    activeConsultations: 0,
    pendingConsultations: 0,
    completedToday: 0,
    pendingRadiologyReviews: 0,
    icuPatientsMonitored: 0,
    criticalAlarms: 0,
    averageResponseTime: 0,
    systemUptime: 99.5,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const data = await apiService.get<DashboardStats>('/dashboard/stats');
      setStats(data);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Konsultasi Aktif',
      value: stats.activeConsultations,
      icon: Video,
      color: 'bg-blue-500',
      link: '/consultations?status=active',
    },
    {
      title: 'Menunggu Review',
      value: stats.pendingConsultations,
      icon: Clock,
      color: 'bg-yellow-500',
      link: '/consultations?status=waiting',
    },
    {
      title: 'Selesai Hari Ini',
      value: stats.completedToday,
      icon: CheckCircle,
      color: 'bg-green-500',
      link: '/consultations?status=completed',
    },
    {
      title: 'Radiologi Pending',
      value: stats.pendingRadiologyReviews,
      icon: Image,
      color: 'bg-purple-500',
      link: '/radiology?status=pending_review',
    },
    {
      title: 'Pasien ICU',
      value: stats.icuPatientsMonitored,
      icon: Activity,
      color: 'bg-indigo-500',
      link: '/teleicu',
    },
    {
      title: 'Alarm Kritis',
      value: stats.criticalAlarms,
      icon: AlertTriangle,
      color: 'bg-red-500',
      link: '/teleicu?alarms=critical',
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Selamat datang, {user?.name || 'Pengguna'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.title} to={stat.link}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {loading ? '...' : stat.value}
                      </p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <Icon className="text-white" size={24} />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Kinerja Sistem">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Response Time Rata-rata</span>
                  <span className="text-sm font-medium text-gray-900">
                    {stats.averageResponseTime} detik
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${Math.min((10 / stats.averageResponseTime) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">System Uptime</span>
                  <span className="text-sm font-medium text-gray-900">
                    {stats.systemUptime}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${stats.systemUptime}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card title="Status Koneksi">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-gray-900">FHIR API</span>
                </div>
                <Badge variant="success">Online</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-gray-900">PACS Server</span>
                </div>
                <Badge variant="success">Online</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-gray-900">Video Server</span>
                </div>
                <Badge variant="success">Online</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-gray-900">Telemetry API</span>
                </div>
                <Badge variant="success">Online</Badge>
              </div>
            </div>
          </Card>
        </div>

        {stats.criticalAlarms > 0 && (
          <Card className="mt-6 border-red-200 bg-red-50">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="text-red-600" size={24} />
              <div>
                <h3 className="font-semibold text-red-900">
                  {stats.criticalAlarms} Alarm Kritis Memerlukan Perhatian
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  Periksa monitoring Tele-ICU untuk detail lebih lanjut.
                </p>
              </div>
              <Link
                to="/teleicu?alarms=critical"
                className="ml-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Lihat Alarm
              </Link>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}
