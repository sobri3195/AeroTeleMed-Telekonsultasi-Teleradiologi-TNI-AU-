import { useEffect, useState } from 'react';
import { Activity, Heart, Wind, Thermometer, AlertTriangle, CheckCircle } from 'lucide-react';
import { Layout } from '../components/common/Layout';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ICUPatient, Alarm } from '../types';
import { teleicuService } from '../services/teleicu.service';
import { formatDateTime, formatTimeAgo, getAlarmColor } from '../utils/helpers';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function TeleICU() {
  const [patients, setPatients] = useState<ICUPatient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<ICUPatient | null>(null);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatients();
    loadAlarms();
    const interval = setInterval(() => {
      loadPatients();
      loadAlarms();
    }, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPatients = async () => {
    try {
      const data = await teleicuService.getICUPatients();
      setPatients(data);
      if (selectedPatient) {
        const updated = data.find(p => p.id === selectedPatient.id);
        if (updated) setSelectedPatient(updated);
      }
    } catch (error) {
      console.error('Failed to load ICU patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAlarms = async () => {
    try {
      const data = await teleicuService.getAlarms();
      setAlarms(data.filter(a => !a.resolved));
    } catch (error) {
      console.error('Failed to load alarms:', error);
    }
  };

  const handleAcknowledgeAlarm = async (alarmId: string) => {
    try {
      await teleicuService.acknowledgeAlarm(alarmId);
      loadAlarms();
    } catch (error) {
      console.error('Failed to acknowledge alarm:', error);
    }
  };

  const handleResolveAlarm = async (alarmId: string) => {
    try {
      await teleicuService.resolveAlarm(alarmId);
      loadAlarms();
    } catch (error) {
      console.error('Failed to resolve alarm:', error);
    }
  };

  const criticalAlarms = alarms.filter(a => a.severity === 'critical');

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Tele-ICU Monitoring</h1>
          <p className="text-gray-600 mt-1">Pemantauan pasien ICU secara real-time</p>
        </div>

        {criticalAlarms.length > 0 && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="text-red-600" size={24} />
                <div>
                  <h3 className="font-semibold text-red-900">
                    {criticalAlarms.length} Alarm Kritis Aktif
                  </h3>
                  <p className="text-sm text-red-700">Memerlukan perhatian segera</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card title="Daftar Pasien ICU">
              <div className="space-y-2">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
                  </div>
                ) : patients.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Tidak ada pasien ICU</p>
                ) : (
                  patients.map((patient) => (
                    <button
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                        selectedPatient?.id === patient.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{patient.patient.name}</h4>
                        <Badge variant={
                          patient.status === 'critical' ? 'danger' :
                          patient.status === 'monitoring' ? 'warning' : 'success'
                        }>
                          {patient.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Bed: {patient.bedNumber}</p>
                        <p>HR: {patient.vitals.heartRate} | SpO₂: {patient.vitals.spO2}%</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </Card>

            <Card title="Alarm Aktif" className="mt-6">
              <div className="space-y-2">
                {alarms.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle size={32} className="text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Tidak ada alarm aktif</p>
                  </div>
                ) : (
                  alarms.slice(0, 5).map((alarm) => (
                    <div
                      key={alarm.id}
                      className={`p-3 rounded-lg border ${getAlarmColor(alarm.severity)}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{alarm.message}</p>
                          <p className="text-xs mt-1">{formatTimeAgo(alarm.timestamp)}</p>
                        </div>
                        <AlertTriangle size={16} />
                      </div>
                      <div className="flex space-x-2">
                        {!alarm.acknowledgedBy && (
                          <button
                            onClick={() => handleAcknowledgeAlarm(alarm.id)}
                            className="text-xs px-2 py-1 bg-white rounded hover:bg-gray-50"
                          >
                            Acknowledge
                          </button>
                        )}
                        <button
                          onClick={() => handleResolveAlarm(alarm.id)}
                          className="text-xs px-2 py-1 bg-white rounded hover:bg-gray-50"
                        >
                          Resolve
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {selectedPatient ? (
              <div className="space-y-6">
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedPatient.patient.name}</h2>
                      <p className="text-sm text-gray-600">
                        Bed {selectedPatient.bedNumber} • {selectedPatient.facility}
                      </p>
                    </div>
                    <Badge variant={
                      selectedPatient.status === 'critical' ? 'danger' :
                      selectedPatient.status === 'monitoring' ? 'warning' : 'success'
                    }>
                      {selectedPatient.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-red-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Heart Rate</span>
                        <Heart size={20} className="text-red-500" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{selectedPatient.vitals.heartRate}</p>
                      <p className="text-xs text-gray-600">bpm</p>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">SpO₂</span>
                        <Activity size={20} className="text-blue-500" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{selectedPatient.vitals.spO2}</p>
                      <p className="text-xs text-gray-600">%</p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Resp. Rate</span>
                        <Wind size={20} className="text-green-500" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{selectedPatient.vitals.respiratoryRate}</p>
                      <p className="text-xs text-gray-600">brpm</p>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Blood Pressure</span>
                        <Activity size={20} className="text-purple-500" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {selectedPatient.vitals.bloodPressureSystolic}/{selectedPatient.vitals.bloodPressureDiastolic}
                      </p>
                      <p className="text-xs text-gray-600">mmHg</p>
                    </div>

                    <div className="p-4 bg-orange-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Temperature</span>
                        <Thermometer size={20} className="text-orange-500" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{selectedPatient.vitals.temperature}</p>
                      <p className="text-xs text-gray-600">°C</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Last Update</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatTimeAgo(selectedPatient.lastUpdated)}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card title="Trend Vital Signs (24 jam)">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={selectedPatient.vitalsHistory.slice(-24)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="timestamp" 
                        tickFormatter={(value) => new Date(value).getHours() + ':00'}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="vitals.heartRate" stroke="#ef4444" name="Heart Rate" />
                      <Line type="monotone" dataKey="vitals.spO2" stroke="#3b82f6" name="SpO₂" />
                      <Line type="monotone" dataKey="vitals.respiratoryRate" stroke="#10b981" name="Resp Rate" />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                {selectedPatient.ventilatorSettings && (
                  <Card title="Pengaturan Ventilator">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Mode:</span>
                        <p className="font-medium text-gray-900">{selectedPatient.ventilatorSettings.mode}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Tidal Volume:</span>
                        <p className="font-medium text-gray-900">{selectedPatient.ventilatorSettings.tidalVolume} ml</p>
                      </div>
                      <div>
                        <span className="text-gray-600">RR:</span>
                        <p className="font-medium text-gray-900">{selectedPatient.ventilatorSettings.respiratoryRate}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">PEEP:</span>
                        <p className="font-medium text-gray-900">{selectedPatient.ventilatorSettings.peep} cmH₂O</p>
                      </div>
                      <div>
                        <span className="text-gray-600">FiO₂:</span>
                        <p className="font-medium text-gray-900">{selectedPatient.ventilatorSettings.fiO2}%</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Pressure:</span>
                        <p className="font-medium text-gray-900">{selectedPatient.ventilatorSettings.pressure} cmH₂O</p>
                      </div>
                    </div>
                  </Card>
                )}

                <Card>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Diagnosis:</span>
                      <p className="font-medium text-gray-900">{selectedPatient.diagnosis}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Dokter Jaga:</span>
                      <p className="font-medium text-gray-900">{selectedPatient.attendingDoctor.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Admission Date:</span>
                      <p className="font-medium text-gray-900">{formatDateTime(selectedPatient.admissionDate)}</p>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <Card>
                <div className="text-center py-20">
                  <Activity size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Pilih pasien untuk melihat detail monitoring</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
