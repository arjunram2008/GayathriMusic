import React from 'react';

type Props = {
  currentMonth: string;
  totalCollected: number;
  paidCount: number;
  totalStudents: number;
};

export default function MonthlySummaryCard({ currentMonth, totalCollected, paidCount, totalStudents }: Props) {
  return (
    <div className="rounded-2xl border border-brand-100 bg-white/80 p-4 shadow-lg shadow-brand-200/30 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">{currentMonth}</p>
          <h2 className="text-2xl font-semibold text-brand-700">Total Collected</h2>
        </div>
        <div className="rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-700">🎤 Studio Edition</div>
      </div>
      <div className="mt-4 flex items-end gap-4">
        <p className="text-4xl font-extrabold text-brand-600">${totalCollected.toFixed(2)}</p>
        <div className="space-y-1 text-sm text-slate-600">
          <p><span className="font-semibold text-slate-800">{paidCount}</span> paid</p>
          <p><span className="font-semibold text-slate-800">{totalStudents}</span> students</p>
        </div>
      </div>
    </div>
  );
}
