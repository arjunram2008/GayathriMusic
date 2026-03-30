import React from 'react';

type Stat = { label: string; value: string; color: string; icon: string };

type Props = {
  stats: Stat[];
};

export default function StatsRow({ stats }: Props) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2">
      <div className="flex gap-3">
        {stats.map((stat, idx) => (
          <div key={idx} className="min-w-[130px] rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition duration-300 hover:shadow-md">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xl">{stat.icon}</span>
              <span className={`rounded-full px-2 py-1 text-xs font-bold text-white ${stat.color}`}>
                {stat.label}
              </span>
            </div>
            <p className="mt-3 text-lg font-bold text-slate-800">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
