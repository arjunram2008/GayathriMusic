import React, { useEffect, useState } from 'react';
import { PaymentMethod, Student } from '../types';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Omit<Student, 'id' | 'lastPaidMonth' | 'lastPaidAmount'>) => void;
  editStudent?: Student | null;
};

const paymentMethods: PaymentMethod[] = ['Bank of America', 'PayPal'];

export default function AddStudentModal({ isOpen, onClose, onSave, editStudent }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Bank of America');

  useEffect(() => {
    if (editStudent) {
      setName(editStudent.name);
      setPhone(editStudent.phone ?? '');
      setPaymentMethod(editStudent.paymentMethod);
    } else {
      setName('');
      setPhone('');
      setPaymentMethod('Bank of America');
    }
  }, [editStudent, isOpen]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      return;
    }

    onSave({
      name: name.trim(),
      phone: phone.trim() || undefined,
      paymentMethod
    });

    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 p-3 sm:items-center">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">{editStudent ? 'Edit Student' : 'Add Student'}</h2>
          <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-800">
            Close
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Name *</span>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              placeholder="Student name"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Phone</span>
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              placeholder="(optional)"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Payment Method</span>
            <select
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            >
              {paymentMethods.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            className="w-full rounded-lg bg-brand-500 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
