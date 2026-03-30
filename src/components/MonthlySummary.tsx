import React, { useState } from 'react';
import { MonthlyGroup } from '../types';
import { formatDate } from '../utils/paymentUtils';

type Props = {
  groups: MonthlyGroup[];
  onScreenBack?: () => void;
};

export default function MonthlySummary({ groups, onScreenBack }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const maxTotal = Math.max(1, ...groups.map(group => group.total));

  return (
    <div className="p-4">
      <div className="mb-3 flex justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Monthly Summary</h2>
        {onScreenBack && (
          <button onClick={onScreenBack} className="text-sm font-medium text-brand-600 hover:underline">
            Back
          </button>
        )}
      </div>

      {groups.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 p-5 text-center">
          <p className="text-sm text-slate-600">No payment history from April 5th, 2026 yet.</p>
        </div>
      ) : (
        <>
          <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <h3 className="mb-2 text-sm font-semibold text-slate-700">Monthly Totals (bar chart)</h3>
            <div className="space-y-2">
              {groups.map(group => (
                <div key={group.monthKey} className="flex items-center gap-3">
                  <span className="w-24 text-xs text-slate-600">{group.monthKey}</span>
                  <div className="h-2 flex-1 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-brand-500"
                      style={{ width: `${(group.total / maxTotal) * 100}%` }}
                    />
                  </div>
                  <span className="w-20 text-right text-xs font-medium text-slate-800">${group.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {groups.map(group => (
              <div key={group.monthKey} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <button
                onClick={() => setExpanded(expanded === group.monthKey ? null : group.monthKey)}
                className="flex w-full items-center justify-between text-left"
              >
                <span>
                  <span className="text-sm text-slate-600">{group.monthKey}</span>
                  <p className="text-lg font-semibold text-slate-900">Total: ${group.total.toFixed(2)}</p>
                  <p className="text-xs text-slate-500">Paid students: {group.paidStudents}</p>
                </span>
                <span className="text-brand-500">{expanded === group.monthKey ? '▴' : '▾'}</span>
              </button>

              {expanded === group.monthKey && (
                <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                  {group.items.map(payment => (
                    <div key={payment.id} className="rounded-lg border border-gray-100 p-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-800">{payment.studentName ?? payment.studentId}</span>
                        <span className="font-semibold text-slate-900">${payment.amount.toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-slate-500">{formatDate(payment.date)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          </div>
        </>
      )}
    </div>
  );
}
