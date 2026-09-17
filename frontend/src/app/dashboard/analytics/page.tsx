import { DashboardShell } from '@/components/superadmin/DashboardShell';
import { AnalyticsView } from '@/components/superadmin/AnalyticsView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Panel Statistik & Analytics | JalanAman Admin',
  description: 'Tren laporan insiden crowdsourcing, komparasi preferensi rute aman, validasi jam rawan malam, dan top koridor berisiko Jabodetabek.',
};

export default function AnalyticsPage() {
  return (
    <DashboardShell>
      <AnalyticsView />
    </DashboardShell>
  );
}
