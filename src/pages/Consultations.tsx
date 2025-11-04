import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Video, Clock, CheckCircle, XCircle, Filter } from 'lucide-react';
import { Layout } from '../components/common/Layout';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Consultation } from '../types';
import { consultationService } from '../services/consultation.service';
import { formatDateTime, getStatusColor, getPriorityColor } from '../utils/helpers';

export function Consultations() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');

  useEffect(() => {
    loadConsultations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const loadConsultations = async () => {
    try {
      setLoading(true);
      const data = await consultationService.getConsultations(statusFilter);
      setConsultations(data);
    } catch (error) {
      console.error('Failed to load consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (status: string) => {
    setStatusFilter(status);
    if (status) {
      setSearchParams({ status });
    } else {
      setSearchParams({});
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Video size={16} className="text-green-600" />;
      case 'waiting':
        return <Clock size={16} className="text-yellow-600" />;
      case 'completed':
        return <CheckCircle size={16} className="text-gray-600" />;
      case 'cancelled':
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <Clock size={16} className="text-blue-600" />;
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Telekonsultasi</h1>
            <p className="text-gray-600 mt-1">Kelola konsultasi pasien jarak jauh</p>
          </div>
          <Link to="/consultations/new">
            <Button>
              <Plus size={20} className="mr-2" />
              Konsultasi Baru
            </Button>
          </Link>
        </div>

        <Card className="mb-6">
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filter Status:</span>
            <div className="flex space-x-2">
              {['', 'scheduled', 'waiting', 'active', 'completed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleFilterChange(status)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === '' ? 'Semua' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {loading ? (
          <Card>
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
              <p className="text-gray-600 mt-4">Memuat data konsultasi...</p>
            </div>
          </Card>
        ) : consultations.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Video size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Tidak ada konsultasi ditemukan</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {consultations.map((consultation) => (
              <Link key={consultation.id} to={`/consultations/${consultation.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {consultation.patient.name}
                        </h3>
                        <Badge className={getStatusColor(consultation.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(consultation.status)}
                            <span>{consultation.status}</span>
                          </div>
                        </Badge>
                        <Badge className={getPriorityColor(consultation.priority)}>
                          {consultation.priority}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Dokter Peminta:</span> {consultation.requestingDoctor.name}
                        </div>
                        <div>
                          <span className="font-medium">Dokter Konsultan:</span>{' '}
                          {consultation.consultantDoctor?.name || 'Belum ditentukan'}
                        </div>
                        <div>
                          <span className="font-medium">Fasilitas:</span> {consultation.patient.facility}
                        </div>
                        <div>
                          <span className="font-medium">Waktu:</span>{' '}
                          {consultation.scheduledAt
                            ? formatDateTime(consultation.scheduledAt)
                            : formatDateTime(consultation.startedAt || new Date().toISOString())}
                        </div>
                      </div>
                    </div>

                    <div className="ml-4">
                      {consultation.status === 'active' && (
                        <Button size="sm">
                          <Video size={16} className="mr-2" />
                          Gabung
                        </Button>
                      )}
                      {consultation.status === 'waiting' && (
                        <Button size="sm" variant="secondary">
                          Terima Konsultasi
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
