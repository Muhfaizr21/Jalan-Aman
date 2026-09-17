import { DashboardShell } from '@/components/superadmin/DashboardShell';
import { NotificationConfigView } from '@/components/superadmin/NotificationConfigView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Konfigurasi Notifikasi Real-Time Area Rawan | JalanAman Admin',
  description: 'Setting radius trigger geofence, jam aktif malam/dini hari per zona operasional, template pesan per tingkat risiko, dan live phone sandbox testing.',
};

export default function NotificationsPage() {
  return (
    <DashboardShell>
      <NotificationConfigView />
    </DashboardShell>
  );
}
