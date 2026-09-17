import { DashboardShell } from '@/components/superadmin/DashboardShell';
import { RouteFeedbackView } from '@/components/superadmin/RouteFeedbackView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Feedback Loop Rating Rute & Anomali AI | JalanAman Admin',
  description: 'Rating pasca-perjalanan pengguna, analisis diskrepansi skor model AI vs realitas, dan active learning pipeline untuk retraining Random Forest.',
};

export default function RouteFeedbackPage() {
  return (
    <DashboardShell>
      <RouteFeedbackView />
    </DashboardShell>
  );
}
