import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Image, Upload, Filter, AlertCircle } from 'lucide-react';
import { Layout } from '../components/common/Layout';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { DicomStudy } from '../types';
import { radiologyService } from '../services/radiology.service';
import { formatDateTime, getStatusColor } from '../utils/helpers';

export function Radiology() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [studies, setStudies] = useState<DicomStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadStudies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const loadStudies = async () => {
    try {
      setLoading(true);
      const data = await radiologyService.getStudies(statusFilter);
      setStudies(data);
    } catch (error) {
      console.error('Failed to load studies:', error);
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

  const handleUpload = async () => {
    if (!uploadFile) return;

    try {
      setUploading(true);
      await radiologyService.uploadDicom(uploadFile, {
        studyDescription: 'New Study',
      });
      setUploadModalOpen(false);
      setUploadFile(null);
      loadStudies();
      alert('File DICOM berhasil diunggah');
    } catch (error) {
      console.error('Failed to upload DICOM:', error);
      alert('Gagal mengunggah file');
    } finally {
      setUploading(false);
    }
  };

  const getModalityBadgeColor = (modality: string) => {
    const colors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
      XR: 'info',
      CT: 'success',
      MRI: 'warning',
      US: 'default',
    };
    return colors[modality] || 'default';
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Teleradiologi</h1>
            <p className="text-gray-600 mt-1">Kelola studi DICOM dan laporan radiologi</p>
          </div>
          <Button onClick={() => setUploadModalOpen(true)}>
            <Upload size={20} className="mr-2" />
            Upload DICOM
          </Button>
        </div>

        <Card className="mb-6">
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filter Status:</span>
            <div className="flex space-x-2">
              {['', 'uploaded', 'pending_review', 'in_review', 'reported', 'finalized'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleFilterChange(status)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === '' ? 'Semua' : status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {loading ? (
          <Card>
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
              <p className="text-gray-600 mt-4">Memuat data radiologi...</p>
            </div>
          </Card>
        ) : studies.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Image size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Tidak ada studi ditemukan</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {studies.map((study) => (
              <Link key={study.id} to={`/radiology/${study.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {study.patient.name}
                        </h3>
                        <Badge variant={getModalityBadgeColor(study.modality)}>
                          {study.modality}
                        </Badge>
                        <Badge className={getStatusColor(study.status)}>
                          {study.status}
                        </Badge>
                        {study.aiTriageResult && (
                          <Badge variant={
                            study.aiTriageResult.severity === 'critical' ? 'danger' :
                            study.aiTriageResult.severity === 'high' ? 'warning' : 'info'
                          }>
                            AI: {study.aiTriageResult.severity}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Deskripsi:</span> {study.studyDescription}
                        </div>
                        <div>
                          <span className="font-medium">Tanggal:</span> {formatDateTime(study.studyDate)}
                        </div>
                        <div>
                          <span className="font-medium">Series:</span> {study.seriesCount}
                        </div>
                        <div>
                          <span className="font-medium">Instances:</span> {study.instanceCount}
                        </div>
                        <div>
                          <span className="font-medium">Diunggah oleh:</span> {study.uploadedBy}
                        </div>
                        {study.radiologist && (
                          <div>
                            <span className="font-medium">Radiolog:</span> {study.radiologist.name}
                          </div>
                        )}
                      </div>

                      {study.aiTriageResult && study.aiTriageResult.findings.length > 0 && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-start space-x-2">
                            <AlertCircle size={16} className="text-yellow-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-yellow-900">AI Triage Findings:</p>
                              <p className="text-sm text-yellow-800">{study.aiTriageResult.findings.join(', ')}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="ml-4">
                      <Button size="sm">
                        <Image size={16} className="mr-2" />
                        Lihat
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload File DICOM"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih File DICOM (.dcm)
            </label>
            <input
              type="file"
              accept=".dcm"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {uploadFile && (
              <p className="text-sm text-gray-600 mt-2">
                File terpilih: {uploadFile.name}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setUploadModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleUpload} loading={uploading} disabled={!uploadFile}>
              Upload
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
