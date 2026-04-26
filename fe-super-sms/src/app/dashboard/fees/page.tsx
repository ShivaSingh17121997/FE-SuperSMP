'use client';

import React, { useState, useMemo } from 'react';
import { Card, Badge, Button, Tabs, DataTable, StatCard } from '@/components/ui';
import { BarChartComponent } from '@/components/charts';
import { CreditCard, Download, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useGetFeesQuery, useUpdateFeeMutation } from '@/store/slices/apiSlice';
import { feeCollectionData } from '@/lib/mock-data';
import type { FeeInvoice, PaymentStatus } from '@/types';
import { useAuth } from '@/hooks';

const statusVariant: Record<PaymentStatus, 'success' | 'warning' | 'danger' | 'info'> = {
  paid: 'success', pending: 'warning', overdue: 'danger', partial: 'info',
};

export default function FeesPage() {
  const { user } = useAuth();
  const canManage = user?.role && ['super-admin', 'school-admin', 'principal'].includes(user.role);

  const userData = user as any;
  const isStudentOrParent = user?.role === 'student' || user?.role === 'parent';
  const queryParams: Record<string, string> = isStudentOrParent && userData?.studentId ? { studentId: String(userData.studentId) } : {};

  const { data: fees = [], isLoading } = useGetFeesQuery(queryParams);
  const [updateFee] = useUpdateFeeMutation();
  const [activeTab, setActiveTab] = useState('all');

  const feeList = fees as FeeInvoice[];
  const filtered = useMemo(() => {
    if (activeTab === 'all') return feeList;
    return feeList.filter(f => f.status === activeTab);
  }, [activeTab, feeList]);

  const totalAmount = feeList.reduce((sum, f) => sum + (f.amount || 0), 0);
  const collectedAmount = feeList.reduce((sum, f) => sum + (f.paidAmount || 0), 0);
  const pendingAmount = totalAmount - collectedAmount;

  const getId = (f: any) => f._id || f.id;

  const handleMarkPaid = async (fee: any) => {
    try {
      await updateFee({ id: getId(fee), body: { status: 'paid' as PaymentStatus, paidAmount: fee.amount } }).unwrap();
    } catch (err) { console.error('Update failed:', err); }
  };

  const columns = [
    { key: 'id', label: 'Invoice', render: (f: any) => (getId(f) || '').slice(-8) },
    { key: 'studentName', label: 'Student' },
    { key: 'class', label: 'Class' },
    { key: 'type', label: 'Type', render: (f: any) => <span className="capitalize">{f.type}</span> },
    { key: 'amount', label: 'Amount', render: (f: any) => `₹${(f.amount || 0).toLocaleString()}` },
    { key: 'paidAmount', label: 'Paid', render: (f: any) => `₹${(f.paidAmount || 0).toLocaleString()}` },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'status', label: 'Status', render: (f: any) => <Badge variant={statusVariant[f.status as PaymentStatus] || 'default'}>{f.status}</Badge> },
    {
      key: 'actions', label: '', render: (f: any) =>
        canManage && f.status !== 'paid' ? (
          <button onClick={() => handleMarkPaid(f)} className="text-xs text-primary-600 hover:text-primary-700 font-medium cursor-pointer">Mark Paid</button>
        ) : null,
    },
  ];

  if (isLoading) return <div className="flex items-center justify-center h-64"><p className="text-text-secondary">Loading fees...</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Fees & Payments</h1>
          <p className="text-sm text-text-secondary mt-1">Track fee invoices and payment status.</p>
        </div>
        {canManage && (
          <div className="flex gap-3">
            <Button variant="outline" icon={Download}>Export</Button>
            <Button icon={CreditCard}>Generate Invoice</Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Billed" value={`₹${totalAmount.toLocaleString()}`} icon={CreditCard} color="indigo" />
        <StatCard title="Collected" value={`₹${collectedAmount.toLocaleString()}`} icon={CheckCircle2} color="green" change={18} changeLabel="this month" />
        <StatCard title="Pending" value={`₹${pendingAmount.toLocaleString()}`} icon={TrendingUp} color="amber" />
        <StatCard title="Overdue" value={feeList.filter(f => f.status === 'overdue').length.toString()} icon={AlertTriangle} color="red" />
      </div>

      <Card>
        <h3 className="text-base font-semibold text-text-primary mb-4">Collection Trend</h3>
        <BarChartComponent data={feeCollectionData} dataKeys={[{ key: 'collected', color: '#6366f1', name: 'Collected' }, { key: 'pending', color: '#f59e0b', name: 'Pending' }]} stacked />
      </Card>

      <Card className="p-4">
        <Tabs tabs={[
          { label: `All (${feeList.length})`, value: 'all' },
          { label: `Paid (${feeList.filter(f => f.status === 'paid').length})`, value: 'paid' },
          { label: `Pending (${feeList.filter(f => f.status === 'pending').length})`, value: 'pending' },
          { label: `Overdue (${feeList.filter(f => f.status === 'overdue').length})`, value: 'overdue' },
        ]} activeTab={activeTab} onChange={setActiveTab} className="mb-4" />
        <DataTable columns={columns} data={filtered} />
      </Card>
    </div>
  );
}
