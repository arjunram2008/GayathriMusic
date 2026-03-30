import React from 'react';

type Filter = 'all' | 'paid' | 'notPaid';

type HeaderProps = {
  currentMonth: string;
  selectedFilter: Filter;
  onFilterChange: (value: Filter) => void;
  onOpenSummary: () => void;
  onSort: () => void;
  showSummary: boolean;
};

const filterLabels: Record<Filter, string> = {
  all: 'All',
  paid: 'Paid',
  notPaid: 'Not Paid'
};

export default function Header({ currentMonth, selectedFilter, onFilterChange, onOpenSummary, onSort, showSummary }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 overflow-hidden rounded-b-3xl bg-gradient-to-r from-emerald-300 via-emerald-200 to-lime-200 p-4 shadow-lg">
      <div className="space-y-1 text-white">
        <p className="text-sm font-medium tracking-widest text-emerald-900 opacity-90">🎵 Student Tracker</p>
        <h1 className="text-2xl font-semibold text-emerald-900">Music Class Payments</h1>
        <p className="text-sm text-emerald-800">{currentMonth}</p>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <button onClick={onSort} className="rounded-xl bg-emerald-100/80 px-4 py-2 text-xs font-semibold text-emerald-800 transition-all duration-300 hover:bg-emerald-200">
          Sort A-Z
        </button>
        <button onClick={onOpenSummary} className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition-all duration-300 hover:bg-emerald-700">
          {showSummary ? '⇠ Back' : 'Monthly Summary'}
        </button>
      </div>

    </header>
  );
}
