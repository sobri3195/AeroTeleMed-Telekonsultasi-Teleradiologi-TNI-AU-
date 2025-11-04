import { apiService } from './api';
import { ICUPatient, Alarm, VitalSignsHistory } from '../types';

export const teleicuService = {
  async getICUPatients(): Promise<ICUPatient[]> {
    return apiService.get<ICUPatient[]>('/teleicu/patients');
  },

  async getICUPatient(id: string): Promise<ICUPatient> {
    return apiService.get<ICUPatient>(`/teleicu/patients/${id}`);
  },

  async getVitalsStream(patientId: string): Promise<unknown> {
    return apiService.get(`/teleicu/stream/${patientId}`);
  },

  async getVitalsHistory(patientId: string, hours: number = 24): Promise<VitalSignsHistory[]> {
    return apiService.get<VitalSignsHistory[]>(`/teleicu/patients/${patientId}/vitals/history`, {
      params: { hours },
    });
  },

  async getAlarms(patientId?: string): Promise<Alarm[]> {
    const params = patientId ? { patient_id: patientId } : {};
    return apiService.get<Alarm[]>('/teleicu/alarms', { params });
  },

  async acknowledgeAlarm(alarmId: string): Promise<Alarm> {
    return apiService.post<Alarm>(`/teleicu/alarms/${alarmId}/acknowledge`);
  },

  async resolveAlarm(alarmId: string): Promise<Alarm> {
    return apiService.post<Alarm>(`/teleicu/alarms/${alarmId}/resolve`);
  },

  async captureSnapshot(patientId: string): Promise<VitalSignsHistory[]> {
    return apiService.post<VitalSignsHistory[]>(`/teleicu/patients/${patientId}/snapshot`);
  },

  async updateVentilatorSettings(patientId: string, settings: unknown): Promise<ICUPatient> {
    return apiService.patch<ICUPatient>(`/teleicu/patients/${patientId}/ventilator`, settings);
  },

  async recordIntervention(patientId: string, intervention: string): Promise<void> {
    await apiService.post(`/teleicu/patients/${patientId}/interventions`, { intervention });
  },
};
