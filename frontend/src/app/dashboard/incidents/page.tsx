import { DashboardShell } from '@/components/superadmin/DashboardShell';
import { IncidentManagementView } from '@/components/superadmin/IncidentManagementView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manajemen Insiden | JalanAman Admin',
  description: 'Verifikasi dan kelola laporan insiden.',
};

export default function IncidentsPage() {
  return (
    <DashboardShell>
      <IncidentManagementView />
    </DashboardShell>
  );
}
