import React from 'react';
import { Student } from '../types';
import { formatDate, getCurrentMonthKey } from '../utils/paymentUtils';

type Props = {
  student: Student;
  onDelete: (id: string) => void;
  onEdit: (student: Student) => void;
  onMarkPaid: (student: Student) => void;
};

export default function StudentCard({ student, onDelete, onEdit, onMarkPaid }: Props) {
  const currentMonth = getCurrentMonthKey();
  const paid = student.lastPaidMonth === currentMonth;

  return (
    <article className={`rounded-2xl border p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${paid ? 'border-emerald-100 bg-emerald-50/80' : 'border-rose-100 bg-rose-50/80'}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-emerald-800">🎻 {student.name}</h2>
          <p className="mt-1 text-xs text-slate-600">{student.paymentMethod} • {student.phone ?? 'No phone'}</p>
        </div>
        <span className={`rounded-full px-2 py-1 text-xs font-bold ${paid ? 'bg-emerald-600 text-white' : 'bg-rose-500 text-white'}`}>
          {paid ? 'Paid' : 'Not Paid'}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-700">
        <div className="rounded-lg border border-slate-200 bg-white p-2">Last month: <span className="font-semibold text-slate-800">{student.lastPaidMonth ?? '—'}</span></div>
        <div className="rounded-lg border border-slate-200 bg-white p-2">Last amount: <span className="font-semibold text-slate-800">{student.lastPaidAmount != null ? `$${student.lastPaidAmount.toFixed(2)}` : '—'}</span></div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={() => onMarkPaid(student)} className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:scale-95 hover:bg-emerald-600">
          Mark Paid
        </button>
        <button onClick={() => onEdit(student)} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
          Edit
        </button>
        <button onClick={() => onDelete(student.id)} className="rounded-full border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-100">
          Delete
        </button>
      </div>
    </article>
  );
}
