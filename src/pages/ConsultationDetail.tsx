import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Video, FileText, Phone, PhoneOff, Send, Paperclip } from 'lucide-react';
import { Layout } from '../components/common/Layout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Consultation, ChatMessage } from '../types';
import { consultationService } from '../services/consultation.service';
import { formatTimeAgo } from '../utils/helpers';

export function ConsultationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [videoActive, setVideoActive] = useState(false);
  const [clinicalNote, setClinicalNote] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
  });

  useEffect(() => {
    if (id) {
      loadConsultation();
      loadMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadConsultation = async () => {
    try {
      if (!id) return;
      const data = await consultationService.getConsultation(id);
      setConsultation(data);
      if (data.clinicalNote) {
        setClinicalNote(data.clinicalNote);
      }
    } catch (error) {
      console.error('Failed to load consultation:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      if (!id) return;
      const data = await consultationService.getChatMessages(id);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !id) return;
    
    try {
      const message = await consultationService.sendMessage(id, newMessage);
      setMessages([...messages, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleStartVideo = async () => {
    try {
      if (!id) return;
      await consultationService.startConsultation(id);
      setVideoActive(true);
    } catch (error) {
      console.error('Failed to start video:', error);
    }
  };

  const handleEndConsultation = async () => {
    try {
      if (!id) return;
      await consultationService.endConsultation(id);
      navigate('/consultations');
    } catch (error) {
      console.error('Failed to end consultation:', error);
    }
  };

  const handleSaveClinicalNote = async () => {
    try {
      if (!id) return;
      await consultationService.saveClinicalNote(id, {
        ...clinicalNote,
        createdAt: new Date().toISOString(),
        createdBy: 'current-user',
      });
      alert('Catatan medis berhasil disimpan');
    } catch (error) {
      console.error('Failed to save clinical note:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !id) return;

    try {
      await consultationService.uploadAttachment(id, file);
      loadConsultation();
      alert('File berhasil diunggah');
    } catch (error) {
      console.error('Failed to upload file:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </Layout>
    );
  }

  if (!consultation) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600">Konsultasi tidak ditemukan</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ruang Konsultasi</h1>
              <p className="text-gray-600 mt-1">Pasien: {consultation.patient.name}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className={consultation.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                {consultation.status}
              </Badge>
              {consultation.status === 'active' && (
                <Button variant="danger" onClick={handleEndConsultation}>
                  <PhoneOff size={20} className="mr-2" />
                  Akhiri Konsultasi
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative">
                {videoActive ? (
                  <div className="text-white text-center">
                    <Video size={48} className="mx-auto mb-4" />
                    <p>Video call aktif</p>
                    <p className="text-sm text-gray-400 mt-2">WebRTC / Jitsi integration akan ditambahkan di sini</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Video size={48} className="text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">Video belum dimulai</p>
                    <Button onClick={handleStartVideo}>
                      <Phone size={20} className="mr-2" />
                      Mulai Video Call
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            <Card title="Chat">
              <div className="space-y-4">
                <div className="h-64 overflow-y-auto border border-gray-200 rounded-lg p-4 space-y-3">
                  {messages.map((message) => (
                    <div key={message.id} className="flex flex-col">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">{message.senderName}</span>
                        <span className="text-xs text-gray-500">{formatTimeAgo(message.timestamp)}</span>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3 text-sm">{message.message}</div>
                    </div>
                  ))}
                  {messages.length === 0 && (
                    <p className="text-center text-gray-500 text-sm">Belum ada pesan</p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ketik pesan..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <label className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Paperclip size={20} className="text-gray-600" />
                    <input type="file" className="hidden" onChange={handleFileUpload} />
                  </label>
                  <Button onClick={handleSendMessage}>
                    <Send size={20} />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Informasi Pasien">
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Nama:</span>
                  <p className="font-medium text-gray-900">{consultation.patient.name}</p>
                </div>
                <div>
                  <span className="text-gray-600">NRP:</span>
                  <p className="font-medium text-gray-900">{consultation.patient.nrp || '-'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Pangkat:</span>
                  <p className="font-medium text-gray-900">{consultation.patient.rank || '-'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Jenis Kelamin:</span>
                  <p className="font-medium text-gray-900">{consultation.patient.gender === 'male' ? 'Laki-laki' : 'Perempuan'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Golongan Darah:</span>
                  <p className="font-medium text-gray-900">{consultation.patient.bloodType || '-'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Fasilitas:</span>
                  <p className="font-medium text-gray-900">{consultation.patient.facility}</p>
                </div>
              </div>
            </Card>

            <Card title="Catatan Medis (SOAP)">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subjective</label>
                  <textarea
                    value={clinicalNote.subjective}
                    onChange={(e) => setClinicalNote({ ...clinicalNote, subjective: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="Keluhan pasien..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Objective</label>
                  <textarea
                    value={clinicalNote.objective}
                    onChange={(e) => setClinicalNote({ ...clinicalNote, objective: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="Pemeriksaan fisik..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assessment</label>
                  <textarea
                    value={clinicalNote.assessment}
                    onChange={(e) => setClinicalNote({ ...clinicalNote, assessment: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="Diagnosis..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                  <textarea
                    value={clinicalNote.plan}
                    onChange={(e) => setClinicalNote({ ...clinicalNote, plan: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="Rencana tindakan..."
                  />
                </div>
                <Button onClick={handleSaveClinicalNote} className="w-full">
                  <FileText size={20} className="mr-2" />
                  Simpan Catatan
                </Button>
              </div>
            </Card>

            {consultation.attachments && consultation.attachments.length > 0 && (
              <Card title="Dokumen Lampiran">
                <div className="space-y-2">
                  {consultation.attachments.map((attachment) => (
                    <a
                      key={attachment.id}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Paperclip size={16} className="text-gray-600 mr-2" />
                      <span className="text-sm text-gray-900">{attachment.name}</span>
                    </a>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
