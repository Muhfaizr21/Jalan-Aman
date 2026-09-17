import { DashboardShell } from '@/components/superadmin/DashboardShell';
import { ModerationView } from '@/components/superadmin/ModerationView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Moderasi Konten & Sensor Privasi Publik | JalanAman Admin',
  description: 'Antrian review independen konten visual & narasi, filter kata ofensif, dan sensor blur privasi korban/pelat nomor sebelum tampil di peta publik.',
};

export default function ModerationPage() {
  return (
    <DashboardShell>
      <ModerationView />
    </DashboardShell>
  );
}
