import { apiService } from './api';
import { DicomStudy, RadiologyReport, AITriageResult } from '../types';

export const radiologyService = {
  async getStudies(status?: string): Promise<DicomStudy[]> {
    const params = status ? { status } : {};
    return apiService.get<DicomStudy[]>('/radiology/studies', { params });
  },

  async getStudy(id: string): Promise<DicomStudy> {
    return apiService.get<DicomStudy>(`/radiology/studies/${id}`);
  },

  async uploadDicom(file: File, metadata: Partial<DicomStudy>): Promise<DicomStudy> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));
    
    return apiService.post<DicomStudy>('/dicom/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async getViewerUrl(studyId: string): Promise<string> {
    const response = await apiService.get<{ url: string }>(`/dicom/viewer-url/${studyId}`);
    return response.url;
  },

  async createReport(studyId: string, report: Omit<RadiologyReport, 'id' | 'studyId' | 'createdAt' | 'createdBy'>): Promise<RadiologyReport> {
    return apiService.post<RadiologyReport>(`/radiology/studies/${studyId}/report`, report);
  },

  async updateReport(studyId: string, reportId: string, report: Partial<RadiologyReport>): Promise<RadiologyReport> {
    return apiService.patch<RadiologyReport>(`/radiology/studies/${studyId}/report/${reportId}`, report);
  },

  async finalizeReport(studyId: string, reportId: string): Promise<RadiologyReport> {
    return apiService.post<RadiologyReport>(`/radiology/studies/${studyId}/report/${reportId}/finalize`);
  },

  async requestAITriage(studyId: string): Promise<AITriageResult> {
    return apiService.post<AITriageResult>(`/ai/triage`, { study_id: studyId });
  },

  async compareStudies(studyId1: string, studyId2: string): Promise<string> {
    const response = await apiService.get<{ url: string }>('/dicom/compare', {
      params: { study1: studyId1, study2: studyId2 },
    });
    return response.url;
  },

  async exportReport(studyId: string, format: 'pdf' | 'fhir'): Promise<Blob> {
    return apiService.get(`/radiology/studies/${studyId}/report/export`, {
      params: { format },
      responseType: 'blob',
    });
  },
};
