import React from 'react';
import { DashboardShell } from '@/components/superadmin/DashboardShell';
import { OverviewView } from '@/components/superadmin/OverviewView';

export const metadata = {
  title: 'Dashboard Admin - JalanAman',
  description: 'Sistem manajemen dan monitoring JalanAman',
};

export default function DashboardPage() {
  return (
    <DashboardShell>
      <OverviewView />
    </DashboardShell>
  );
}
