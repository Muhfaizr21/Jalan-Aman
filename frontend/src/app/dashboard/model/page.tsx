import { DashboardShell } from '@/components/superadmin/DashboardShell';
import { ModelManagementView } from '@/components/superadmin/ModelManagementView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Panel Model AI & Risk Scoring | JalanAman Admin',
  description: 'Pengawasan dan kalibrasi model Random Forest Spatiotemporal tingkat bahaya jalan.',
};

export default function ModelPage() {
  return (
    <DashboardShell>
      <ModelManagementView />
    </DashboardShell>
  );
}
