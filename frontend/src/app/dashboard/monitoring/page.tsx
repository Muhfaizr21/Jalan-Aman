import { DashboardShell } from '@/components/superadmin/DashboardShell';
import { MonitoringView } from '@/components/superadmin/MonitoringView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sistem Monitoring & Job Queue | JalanAman Admin',
  description: 'Dashboard status background job (DBSCAN, Random Forest, Sync eksternal), telemetri performa A* routing engine, dan alert kegagalan.',
};

export default function MonitoringPage() {
  return (
    <DashboardShell>
      <MonitoringView />
    </DashboardShell>
  );
}
