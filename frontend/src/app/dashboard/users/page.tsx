import { DashboardShell } from '@/components/superadmin/DashboardShell';
import { UserManagementView } from '@/components/superadmin/UserManagementView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manajemen Pengguna | JalanAman Admin',
  description: 'Pengelolaan akun, skor kredibilitas crowdsourcing, dan moderasi peran pengguna.',
};

export default function UsersPage() {
  return (
    <DashboardShell>
      <UserManagementView />
    </DashboardShell>
  );
}
