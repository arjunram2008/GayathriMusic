import React, { useMemo, useState } from 'react';
import { Student, MonthlyGroup } from '../types';

type Props = {
  groups: MonthlyGroup[];
  selectedMonth: string;
  students: Student[];
  onPaymentUpdate: (studentId: string, amount: number) => void;
  monthLabel?: string;
  onMonthChange?: (month: string) => void;
  monthOptions?: { key: string; label: string }[];
};

export default function MonthlySummary({
  groups,
  selectedMonth,
  students,
  onPaymentUpdate,
  monthLabel,
  onMonthChange,
  monthOptions = []
}: Props) {
  const [browsing, setBrowsing] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');

  // Calculate dashboard data upfront - before any conditional returns
  const activeGroup = groups.find(g => g.monthKey === selectedMonth) || {
    monthKey: selectedMonth,
    items: [],
    total: 0,
    paidStudents: 0
  };

  const totalCollected = activeGroup.total;
  const paidCount = activeGroup.paidStudents;
  const unpaidCount = students.length - paidCount;
  const completionRate = students.length > 0 ? Math.round((paidCount / students.length) * 100) : 0;

  const studentPayments = useMemo(() => {
    return students
      .map(student => {
        const payment = activeGroup.items.find(item => item.studentId === student.id);
        return {
          student,
          amount: payment ? payment.amount : 0,
          status: payment && payment.amount > 0 ? 'paid' : 'unpaid'
        };
      })
      .sort((a, b) => a.student.name.localeCompare(b.student.name));
  }, [students, activeGroup.items]);

  const handleMonthSelect = (monthKey: string) => {
    setBrowsing(false);
    onMonthChange?.(monthKey);
  };

  const handleBack = () => {
    setBrowsing(true);
  };

  const handleEditStart = (studentId: string, currentAmount: number) => {
    setEditingId(studentId);
    setEditAmount(currentAmount.toString());
  };

  const handleEditSave = (studentId: string) => {
    const amount = parseFloat(editAmount);
    if (!isNaN(amount) && amount >= 0) {
      onPaymentUpdate(studentId, amount);
      setEditingId(null);
      setEditAmount('');
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditAmount('');
  };

  // Now render based on browsing state
  if (browsing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 via-brand-100 to-brand-200 p-4 pb-32">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Financial Summary</h1>
          <p className="mt-1 text-sm text-slate-600">Select a month to view detailed payments</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {monthOptions.map(option => {
            const group = groups.find(g => g.monthKey === option.key);
            const total = group?.total ?? 0;
            const paidStudents = group?.paidStudents ?? 0;
            const unpaidCount = students.length - paidStudents;
            const completionRate = students.length > 0 ? Math.round((paidStudents / students.length) * 100) : 0;

            return (
              <button
                key={option.key}
                onClick={() => handleMonthSelect(option.key)}
                className="rounded-2xl border-2 border-brand-200 bg-white p-6 text-left shadow-lg transition-all duration-200 hover:border-brand-400 hover:shadow-xl active:scale-95"
              >
                {/* Month Label */}
                <h2 className="text-xl font-bold text-slate-900">{option.label}</h2>

                {/* Summary Stats */}
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Collected</span>
                    <span className="text-lg font-semibold text-slate-900">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Paid Students</span>
                    <span className="text-lg font-semibold text-brand-600">{paidStudents}/{students.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Completion</span>
                    <span className="text-lg font-semibold text-slate-900">{completionRate}%</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mt-4">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      unpaidCount === 0
                        ? 'bg-green-100 text-green-700'
                        : unpaidCount === students.length
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {unpaidCount === 0 ? '✓ All Paid' : unpaidCount === students.length ? '⚠ No Payments' : `⚠ ${unpaidCount} Unpaid`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {monthOptions.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
            <p className="text-slate-600">No months available yet.</p>
          </div>
        )}
      </div>
    );
  }

  // Dashboard view
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-brand-100 to-brand-200 p-4 pb-32">
      {/* Header with Back Button */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{monthLabel || selectedMonth}</h1>
          <p className="mt-1 text-sm text-slate-600">Financial Summary</p>
        </div>
        <button
          onClick={handleBack}
          className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-300"
        >
          ← Back
        </button>
      </div>

      {/* Top Metrics */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Total Collected */}
        <div className="rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Collected</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">${totalCollected.toFixed(2)}</p>
            </div>
            <div className="rounded-full bg-green-100 p-3 text-2xl">💚</div>
          </div>
        </div>

        {/* Total Unpaid */}
        <div className="rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Unpaid</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{unpaidCount} {unpaidCount === 1 ? 'Student' : 'Students'}</p>
            </div>
            <div className="rounded-full bg-red-100 p-3 text-2xl">❌</div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Completion Rate</p>
              <p className="mt-2 text-3xl font-bold text-brand-600">{completionRate}%</p>
            </div>
            <div className="rounded-full bg-brand-100 p-3 text-2xl">📊</div>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
        <div className="mb-4">
          <p className="text-sm font-medium text-slate-600">Payment Progress</p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {paidCount} of {students.length} students paid
          </p>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-slate-500">
          <span>{paidCount} paid</span>
          <span>{unpaidCount} unpaid</span>
        </div>
      </div>

      {/* Student Table */}
      <div className="rounded-2xl bg-white shadow-lg">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Student Payments</h2>
        </div>

        {studentPayments.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-slate-600">No students added yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {studentPayments.map(({ student, amount, status }, index) => (
              <div key={student.id} className="px-6 py-4 transition-all duration-200 hover:bg-slate-50">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{student.name}</p>
                        {student.classType && <p className="text-xs text-slate-500">{student.classType}</p>}
                        {student.parentName && <p className="text-xs text-slate-400">Parent: {student.parentName}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Amount Paid - Editable */}
                    <div className="text-right">
                      {editingId === student.id ? (
                        <div className="flex gap-2">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editAmount}
                            onChange={e => setEditAmount(e.target.value)}
                            className="w-24 rounded-lg border border-brand-300 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-brand-200"
                            autoFocus
                          />
                          <button
                            onClick={() => handleEditSave(student.id)}
                            className="rounded-lg bg-brand-500 px-3 py-1 text-sm font-semibold text-white hover:bg-brand-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleEditCancel}
                            className="rounded-lg border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-100"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => handleEditStart(student.id, amount)}
                          className="cursor-pointer rounded-lg bg-slate-50 px-3 py-1 text-right transition-all duration-200 hover:bg-slate-100"
                        >
                          <p className="text-sm font-semibold text-slate-900">${amount.toFixed(2)}</p>
                          <p className="text-xs text-slate-500">Click to edit</p>
                        </div>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div className="text-right">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          status === 'paid'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {status === 'paid' ? '✓ Paid' : 'Unpaid'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
