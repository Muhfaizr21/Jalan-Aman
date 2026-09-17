import { DashboardShell } from '@/components/superadmin/DashboardShell';
import { AuditLogView } from '@/components/superadmin/AuditLogView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sistem Audit Log | JalanAman Admin',
  description: 'Log riwayat seluruh aktivitas administratif dan perubahan data superadmin.',
};

export default function AuditLogPage() {
  return (
    <DashboardShell>
      <AuditLogView />
    </DashboardShell>
  );
}
