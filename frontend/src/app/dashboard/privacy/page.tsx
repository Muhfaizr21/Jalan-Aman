import { DashboardShell } from '@/components/superadmin/DashboardShell';
import { PrivacyExportView } from '@/components/superadmin/PrivacyExportView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Data Export & Kepatuhan Privasi (UU PDP) | JalanAman Admin',
  description: 'Ekspor data agregat tanpa PII untuk kepolisian & dinas terkait, kebijakan retensi data, log akses data sensitif, dan consent tracking.',
};

export default function PrivacyPage() {
  return (
    <DashboardShell>
      <PrivacyExportView />
    </DashboardShell>
  );
}
