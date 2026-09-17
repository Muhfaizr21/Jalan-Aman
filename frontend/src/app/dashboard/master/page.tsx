import { DashboardShell } from '@/components/superadmin/DashboardShell';
import { MasterContentView } from '@/components/superadmin/MasterContentView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manajemen Konten Master & Konfigurasi Sistem | JalanAman Admin',
  description: 'CRUD kategori insiden, kalibrasi threshold skor risiko aman/waspada/berisiko, dan konfigurasi default DBSCAN engine.',
};

export default function MasterContentPage() {
  return (
    <DashboardShell>
      <MasterContentView />
    </DashboardShell>
  );
}
