import { DashboardShell } from '@/components/superadmin/DashboardShell';
import { ClusterManagementView } from '@/components/superadmin/ClusterManagementView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Peta Klaster DBSCAN | JalanAman Admin',
  description: 'Visualisasi hasil pengelompokan titik rawan.',
};

export default function ClustersPage() {
  return (
    <DashboardShell>
      <ClusterManagementView />
    </DashboardShell>
  );
}
