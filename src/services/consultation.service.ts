import { apiService } from './api';
import { Consultation, ClinicalNote, ChatMessage, Attachment, VideoSession } from '../types';

export const consultationService = {
  async getConsultations(status?: string): Promise<Consultation[]> {
    const params = status ? { status } : {};
    return apiService.get<Consultation[]>('/consultations', { params });
  },

  async getConsultation(id: string): Promise<Consultation> {
    return apiService.get<Consultation>(`/consultations/${id}`);
  },

  async createConsultation(data: Partial<Consultation>): Promise<Consultation> {
    return apiService.post<Consultation>('/consultations', data);
  },

  async updateConsultation(id: string, data: Partial<Consultation>): Promise<Consultation> {
    return apiService.patch<Consultation>(`/consultations/${id}`, data);
  },

  async startConsultation(id: string): Promise<Consultation> {
    return apiService.post<Consultation>(`/consultations/${id}/start`);
  },

  async endConsultation(id: string): Promise<Consultation> {
    return apiService.post<Consultation>(`/consultations/${id}/end`);
  },

  async saveClinicalNote(consultationId: string, note: ClinicalNote): Promise<Consultation> {
    return apiService.post<Consultation>(`/consultations/${consultationId}/clinical-note`, note);
  },

  async getChatMessages(consultationId: string): Promise<ChatMessage[]> {
    return apiService.get<ChatMessage[]>(`/consultations/${consultationId}/messages`);
  },

  async sendMessage(consultationId: string, message: string): Promise<ChatMessage> {
    return apiService.post<ChatMessage>(`/consultations/${consultationId}/messages`, { message });
  },

  async uploadAttachment(consultationId: string, file: File): Promise<Attachment> {
    const formData = new FormData();
    formData.append('file', file);
    return apiService.post<Attachment>(`/consultations/${consultationId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async getAttachments(consultationId: string): Promise<Attachment[]> {
    return apiService.get<Attachment[]>(`/consultations/${consultationId}/attachments`);
  },

  async createVideoSession(consultationId: string): Promise<VideoSession> {
    return apiService.post<VideoSession>(`/consultations/${consultationId}/video/create`);
  },

  async endVideoSession(sessionId: string): Promise<void> {
    await apiService.post(`/video/sessions/${sessionId}/end`);
  },

  async getPatientRME(patientId: string): Promise<unknown> {
    return apiService.get(`/fhir/Patient/${patientId}`);
  },
};
