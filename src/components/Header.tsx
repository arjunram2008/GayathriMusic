import React from 'react';

type Tab = 'students' | 'summary' | 'attendance';

type HeaderProps = {
  currentMonth: string;
  selectedFilter: 'all' | 'paid' | 'notPaid';
  onFilterChange: (value: 'all' | 'paid' | 'notPaid') => void;
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
  onSort: () => void;
};

const filterLabels: Record<'all' | 'paid' | 'notPaid', string> = {
  all: 'All',
  paid: 'Paid',
  notPaid: 'Not Paid'
};

const tabLabels: Record<Tab, string> = {
  students: 'Students',
  summary: 'Summary',
  attendance: 'Attendance'
};

export default function Header({ currentMonth, selectedFilter, onFilterChange, currentTab, onTabChange, onSort }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 overflow-hidden rounded-b-3xl bg-gradient-to-r from-brand-300 via-brand-200 to-brand-100 p-4 shadow-lg">
      <div className="space-y-1 text-white">
        <p className="text-sm font-medium tracking-widest text-brand-900 opacity-90">🎵 Student Tracker</p>
        <h1 className="text-2xl font-semibold text-brand-900">Music Class Payments</h1>
        <p className="text-sm text-brand-800">{currentMonth}</p>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <button onClick={onSort} className="rounded-xl bg-brand-100/80 px-4 py-2 text-xs font-semibold text-brand-800 transition-all duration-300 hover:bg-brand-200">
          Sort A-Z
        </button>
        <div className="flex gap-2">
          {Object.entries(tabLabels).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab as Tab)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                currentTab === tab
                  ? 'bg-brand-600 text-white'
                  : 'bg-brand-100/80 text-brand-800 hover:bg-brand-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

    </header>
  );
}
