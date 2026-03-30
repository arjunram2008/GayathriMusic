import React from 'react';

type Filter = 'all' | 'paid' | 'notPaid';

type Props = {
  selected: Filter;
  onChange: (value: Filter) => void;
};

const labels: Record<Filter, string> = {
  all: 'All',
  paid: 'Paid',
  notPaid: 'Unpaid'
};

export default function FilterPills({ selected, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto p-2">
      {(['all', 'paid', 'notPaid'] as Filter[]).map(filter => {
        const active = selected === filter;
        return (
          <button
            key={filter}
            onClick={() => onChange(filter)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
              active
                ? 'bg-brand-500 text-white shadow-md shadow-brand-300/50'
                : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-brand-100'
            }`}
          >
            {labels[filter]}
          </button>
        );
      })}
    </div>
  );
}
