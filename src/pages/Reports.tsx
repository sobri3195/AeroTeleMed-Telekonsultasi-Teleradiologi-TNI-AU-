import { useState } from 'react';
import { FileText, Download, Filter, Calendar } from 'lucide-react';
import { Layout } from '../components/common/Layout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export function Reports() {
  const [reportType, setReportType] = useState('all');

  const reports = [
    {
      id: '1',
      title: 'Laporan Konsultasi Bulan November',
      type: 'consultation',
      date: '2024-11-30',
      size: '2.5 MB',
    },
    {
      id: '2',
      title: 'Laporan Radiologi Bulan November',
      type: 'radiology',
      date: '2024-11-30',
      size: '5.2 MB',
    },
    {
      id: '3',
      title: 'Laporan Tele-ICU Bulan November',
      type: 'teleicu',
      date: '2024-11-30',
      size: '3.1 MB',
    },
  ];

  const filteredReports = reportType === 'all' 
    ? reports 
    : reports.filter(r => r.type === reportType);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Laporan</h1>
          <p className="text-gray-600 mt-1">Akses dan unduh laporan sistem</p>
        </div>

        <Card className="mb-6">
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filter Tipe:</span>
            <div className="flex space-x-2">
              {['all', 'consultation', 'radiology', 'teleicu'].map((type) => (
                <button
                  key={type}
                  onClick={() => setReportType(type)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    reportType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type === 'all' ? 'Semua' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FileText size={24} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1">{report.title}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    <Calendar size={14} />
                    <span>{report.date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="info">{report.size}</Badge>
                    <Button size="sm" variant="ghost">
                      <Download size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <FileText size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Tidak ada laporan ditemukan</p>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}
