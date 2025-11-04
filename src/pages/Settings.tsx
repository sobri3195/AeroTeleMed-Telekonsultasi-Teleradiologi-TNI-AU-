import { useState } from 'react';
import { User, Bell, Video, Shield, Save } from 'lucide-react';
import { Layout } from '../components/common/Layout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuthStore } from '../stores/authStore';

export function Settings() {
  const { user } = useAuthStore();
  const [settings, setSettings] = useState({
    videoQuality: 'auto',
    audioEnabled: true,
    notificationsEnabled: true,
    sessionTimeout: 15,
  });

  const handleSave = () => {
    alert('Pengaturan berhasil disimpan');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Pengaturan</h1>
          <p className="text-gray-600 mt-1">Kelola preferensi dan konfigurasi akun Anda</p>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <User size={24} className="text-gray-700" />
              <h2 className="text-xl font-semibold text-gray-900">Profil</h2>
            </div>
            
            <div className="space-y-4">
              <Input label="Nama Lengkap" value={user?.name || ''} disabled />
              <Input label="Username" value={user?.username || ''} disabled />
              <Input label="Email" value={user?.email || ''} type="email" />
              <Input label="No. Telepon" value={user?.phone || ''} type="tel" />
              <Input label="Fasilitas" value={user?.facility || ''} disabled />
            </div>
          </Card>

          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <Video size={24} className="text-gray-700" />
              <h2 className="text-xl font-semibold text-gray-900">Video & Audio</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kualitas Video
                </label>
                <select
                  value={settings.videoQuality}
                  onChange={(e) => setSettings({ ...settings, videoQuality: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Rendah (512 kbps)</option>
                  <option value="medium">Sedang (1 Mbps)</option>
                  <option value="high">Tinggi (2 Mbps)</option>
                  <option value="auto">Otomatis</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Audio Enabled</p>
                  <p className="text-sm text-gray-600">Aktifkan audio secara default</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.audioEnabled}
                  onChange={(e) => setSettings({ ...settings, audioEnabled: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <Bell size={24} className="text-gray-700" />
              <h2 className="text-xl font-semibold text-gray-900">Notifikasi</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Notifikasi Aktif</p>
                  <p className="text-sm text-gray-600">Terima notifikasi untuk konsultasi dan alarm</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notificationsEnabled}
                  onChange={(e) => setSettings({ ...settings, notificationsEnabled: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <Shield size={24} className="text-gray-700" />
              <h2 className="text-xl font-semibold text-gray-900">Keamanan</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Timeout (menit)
                </label>
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                  min="5"
                  max="60"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Sesi akan otomatis logout setelah tidak aktif selama periode ini
                </p>
              </div>

              <Button variant="secondary" className="w-full">
                Ubah Password
              </Button>
            </div>
          </Card>

          <div className="flex justify-end space-x-3">
            <Button variant="secondary">Batal</Button>
            <Button onClick={handleSave}>
              <Save size={20} className="mr-2" />
              Simpan Perubahan
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
