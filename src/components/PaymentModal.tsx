import React, { useEffect, useState } from 'react';
import { Student } from '../types';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onSave: (amount: number) => void;
};

export default function PaymentModal({ isOpen, onClose, student, onSave }: Props) {
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setAmount('');
    }
  }, [isOpen]);

  if (!isOpen || !student) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      return;
    }
    onSave(parsed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/30 p-3 sm:items-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Mark {student.name} as Paid</h2>
          <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-800">
            Close
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <p className="text-sm text-slate-600">Enter the amount received today:</p>
          <input
            value={amount}
            onChange={e => setAmount(e.target.value)}
            type="number"
            step="0.01"
            min="0"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            placeholder="Amount"
            required
          />
          <button type="submit" className="w-full rounded-lg bg-brand-500 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-600">
            Confirm Payment
          </button>
        </div>
      </form>
    </div>
  );
}
