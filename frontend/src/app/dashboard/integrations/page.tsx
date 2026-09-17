import { DashboardShell } from '@/components/superadmin/DashboardShell';
import { IntegrationsView } from '@/components/superadmin/IntegrationsView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manajemen Integrasi Eksternal & API Partner | JalanAman Admin',
  description: 'Konfigurasi koneksi kepolisian, log audit sinkronisasi, manajemen API key mitra ojol dengan rate limit, dan mapping skema data eksternal.',
};

export default function IntegrationsPage() {
  return (
    <DashboardShell>
      <IntegrationsView />
    </DashboardShell>
  );
}
